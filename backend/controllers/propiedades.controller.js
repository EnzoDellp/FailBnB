const db = require("../models/db");
const cloudinary = require("../config/cloudinary");

function getFechasEntre(inicio, fin) {
  const fechas = [];
  let current = new Date(inicio);
  const end = new Date(fin);
  while (current <= end) {
    fechas.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return fechas;
}

const getAllpropiedades = (req, res, next) => {
  const query = `
    SELECT
      p.*,
      (SELECT url_imagen FROM imagenes_propiedad WHERE id_propiedad = p.id ORDER BY id LIMIT 1) AS portada
    FROM propiedades p
  `;
  db.query(query, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
};

const getPropiedadById = (req, res, next) => {
  const id = req.params.id;

  const propQuery = `
    SELECT p.*,
           u.nombre AS nombre_anfitrion,
           u.apellido AS apellido_anfitrion,
           u.fecha_registro AS fecha_anfitrion
    FROM propiedades p
    JOIN usuarios u ON p.id_usuario = u.id
    WHERE p.id = ?
  `;
  const imgQuery = `SELECT url_imagen FROM imagenes_propiedad WHERE id_propiedad = ?`;

  db.query(propQuery, [id], (err, propResult) => {
    if (err) return next(err);
    if (propResult.length === 0)
      return res.status(404).json({ error: "No encontrada" });

    db.query(imgQuery, [id], (err2, imgResults) => {
      if (err2) return next(err2);

      const propiedad = propResult[0];
      propiedad.imagenes = imgResults.map((img) => img.url_imagen);
      propiedad.anfitrion = {
        nombre: propiedad.nombre_anfitrion,
        apellido: propiedad.apellido_anfitrion,
        fecha_registro: propiedad.fecha_anfitrion,
      };
      delete propiedad.nombre_anfitrion;
      delete propiedad.apellido_anfitrion;
      delete propiedad.fecha_anfitrion;

      res.json(propiedad);
    });
  });
};

const createPropiedad = async (req, res, next) => {
  const id_usuario = req.usuario.id;
  const {
    titulo,
    descripcion,
    direccion,
    cant_habitaciones,
    cant_baños,
    capacidad_max,
    precio_noche,
    ubicacion,
    imagenes = [],
    fecha_inicio_disponibilidad,
    fecha_fin_disponibilidad,
  } = req.body;

  if (!id_usuario || !titulo || !capacidad_max || !precio_noche) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const imageUrls = await Promise.all(
      imagenes.map((img) =>
        cloudinary.uploader.upload(img, { folder: "failbnb" }),
      ),
    );
    const urls = imageUrls.map((result) => result.secure_url);

    const insertPropQuery = `
      INSERT INTO propiedades (id_usuario, titulo, descripcion, direccion, cant_habitaciones, cant_baños, capacidad_max, precio_noche, ubicacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertPropQuery,
      [
        id_usuario,
        titulo,
        descripcion,
        direccion,
        cant_habitaciones,
        cant_baños,
        capacidad_max,
        precio_noche,
        ubicacion,
      ],
      (err, result) => {
        if (err) return next(err);

        const propiedadId = result.insertId;

        if (fecha_inicio_disponibilidad && fecha_fin_disponibilidad) {
          const fechas = getFechasEntre(
            fecha_inicio_disponibilidad,
            fecha_fin_disponibilidad,
          );
          const disponibilidadValues = fechas.map((f) => [propiedadId, f]);
          db.query(
            `INSERT INTO disponibilidad (id_propiedad, fecha) VALUES ?`,
            [disponibilidadValues],
            (errDisp) => {
              if (errDisp)
                console.error("Error al insertar disponibilidad:", errDisp);
            },
          );
        }

        if (urls.length === 0) {
          return res.status(201).json({
            message: "Propiedad creada sin imágenes",
            id: propiedadId,
          });
        }

        const values = urls.map((url) => [propiedadId, url]);
        db.query(
          `INSERT INTO imagenes_propiedad (id_propiedad, url_imagen) VALUES ?`,
          [values],
          (errImg) => {
            if (errImg) return next(errImg);
            res.status(201).json({
              message: "Propiedad e imágenes guardadas con éxito",
              id: propiedadId,
            });
          },
        );
      },
    );
  } catch (err) {
    next(err);
  }
};

const updatePropiedad = (req, res, next) => {
  const id = req.params.id;
  const id_usuario = req.usuario.id;
  const {
    titulo,
    descripcion,
    direccion,
    cant_habitaciones,
    cant_baños,
    capacidad_max,
    precio_noche,
    ubicacion,
  } = req.body;

  const query = `
    UPDATE propiedades SET
    titulo = ?, descripcion = ?, direccion = ?, cant_habitaciones = ?, cant_baños = ?, capacidad_max = ?, precio_noche = ?, ubicacion = ?
    WHERE id = ? AND id_usuario=?
  `;

  db.query(
    query,
    [
      titulo,
      descripcion,
      direccion,
      cant_habitaciones,
      cant_baños,
      capacidad_max,
      precio_noche,
      ubicacion,
      id,
      id_usuario,
    ],
    (err, result) => {
      if (err) return next(err);
      if (result.affectedRows === 0)
        return res
          .status(403)
          .json({ error: "No autorizado o propiedad no encontrada" });
      res.json({ message: "Propiedad actualizada" });
    },
  );
};

const deletePropiedad = (req, res, next) => {
  const id = req.params.id;
  const id_usuario = req.usuario.id;
  db.query(
    "DELETE FROM propiedades WHERE id = ? AND id_usuario=?",
    [id, id_usuario],
    (err, result) => {
      if (err) return next(err);
      if (result.affectedRows === 0)
        return res
          .status(403)
          .json({ error: "No Autorizado o Propiedad no Encontrada" });
      res.json({ message: "Propiedad eliminada" });
    },
  );
};

const getImagenesByPropiedad = (req, res, next) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM imagenes_propiedad WHERE id_propiedad = ?",
    [id],
    (err, results) => {
      if (err) return next(err);
      res.json(results);
    },
  );
};

const buscarPropiedadesDisponibles = (req, res, next) => {
  const { ubicacion, checkin, checkout, viajeros } = req.query;

  if (!ubicacion || !checkin || !checkout || !viajeros) {
    return res.status(400).json({ error: "Faltan parámetros de búsqueda" });
  }

  const query = `
    SELECT p.*,
      (SELECT url_imagen FROM imagenes_propiedad WHERE id_propiedad = p.id LIMIT 1) AS portada
    FROM propiedades p
    WHERE p.ubicacion LIKE ?
      AND p.capacidad_max >= ?
      AND p.id NOT IN (
        SELECT d.id_propiedad
        FROM disponibilidad d
        WHERE d.fecha BETWEEN ? AND ? AND d.disponible = 0
        GROUP BY d.id_propiedad
      )
  `;

  db.query(
    query,
    [`%${ubicacion}%`, parseInt(viajeros), checkin, checkout],
    (err, results) => {
      if (err) return next(err);
      res.json(results);
    },
  );
};

const filtrarPropiedades = (req, res, next) => {
  const { ubicacion, checkin, checkout, viajeros } = req.query;

  if (!ubicacion || !checkin || !checkout || !viajeros) {
    return res.status(400).json({ error: "Faltan parámetros de búsqueda" });
  }

  const fechas = [];
  let current = new Date(checkin);
  const end = new Date(checkout);
  while (current <= end) {
    fechas.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  const placeholders = fechas.map(() => "?").join(",");

  const sql = `
    SELECT DISTINCT p.*,
      (SELECT url_imagen FROM imagenes_propiedad WHERE id_propiedad = p.id ORDER BY id LIMIT 1) AS portada
    FROM propiedades p
    JOIN disponibilidad d ON p.id = d.id_propiedad
    WHERE p.ubicacion LIKE ?
      AND p.capacidad_max >= ?
      AND d.fecha IN (${placeholders})
      AND d.disponible = TRUE
    GROUP BY p.id
    HAVING COUNT(d.fecha) = ?
  `;

  const values = [
    `%${ubicacion}%`,
    parseInt(viajeros),
    ...fechas,
    fechas.length,
  ];

  db.query(sql, values, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
};
const getMisAnuncios = (req, res, next) => {
  const id_usuario = req.usuario.id;
  db.query(
    `SELECT p.*,(SELECT url_imagen FROM imagenes_propiedad WHERE id_propiedad= p.id ORDER BY id LIMIT 1) AS portada FROM propiedades p WHERE p.id_usuario=?`,
    [id_usuario],
    (err, results) => {
      if (err) return next(err);
      res.json(results);
    },
  );
};
module.exports = {
  getAllpropiedades,
  getPropiedadById,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
  getImagenesByPropiedad,
  buscarPropiedadesDisponibles,
  filtrarPropiedades,
  getMisAnuncios,
};
