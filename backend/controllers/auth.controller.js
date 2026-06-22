const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginUsuario = (req, res, next) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const query = "SELECT * FROM usuarios WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = results[0];

    // Comparar contraseña hasheada (usar esto con bcrypt):
    const match = await bcrypt.compare(pass, usuario.pass);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        es_anfitrion: usuario.es_anfitrion,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  });
};

const registerUsuario = async (req, res, next) => {
  const { nombre, apellido, email, pass, telefono, es_anfitrion } = req.body;

  if (!nombre || !apellido || !email || !pass) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const queryCheck = "SELECT * FROM usuarios WHERE email = ?";
    db.query(queryCheck, [email], async (err, results) => {
      if (err) return next(err);
      if (results.length > 0) {
        return res.status(409).json({ error: "El usuario ya existe" });
      }

      const hashedPass = await bcrypt.hash(pass, 10);

      const insertQuery = `
        INSERT INTO usuarios (nombre, apellido, email, pass, telefono, es_anfitrion)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [
          nombre,
          apellido,
          email,
          hashedPass,
          telefono || null,
          es_anfitrion ? 1 : 0,
        ],
        (err, result) => {
          if (err) return next(err);
          const token = jwt.sign(
            { id: result.insertId, email, es_anfitrion: !!es_anfitrion },
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
          );
          res.status(201).json({
            message: "Usuario registrado con éxito",
            token,
            usuario: {
              id: result.insertId,
              nombre,
              apellido,
              email,
              telefono: telefono || null,
              es_anfitrion: !!es_anfitrion,
            },
          });
        },
      );
    });
  } catch (err) {
    next(err);
  }
};

const eliminarUsuario = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  const deleteQuery = "DELETE FROM usuarios WHERE id = ?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) return next(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  });
};

const actualizarUsuario = (req, res, next) => {
  const { id } = req.params;
  const { nombre, apellido, email, telefono, es_anfitrion } = req.body;

  if (!nombre || !apellido || !email) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const updateQuery = `
    UPDATE usuarios
    SET nombre = ?, apellido = ?, email = ?, telefono = ?, es_anfitrion = ?
    WHERE id = ?
  `;

  db.query(
    updateQuery,
    [nombre, apellido, email, telefono || null, es_anfitrion ? 1 : 0, id],
    (err, result) => {
      if (err) return next(err);

      res.json({ message: "Usuario actualizado correctamente" });
    },
  );
};

module.exports = {
  loginUsuario,
  registerUsuario,
  eliminarUsuario,
  actualizarUsuario,
};
