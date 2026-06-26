const db = require("../models/db");
const crearReservas = async (req, res, next) => {
  const id_usuario = req.usuario.id;
  const { id_propiedad, fecha_ingreso, fecha_egreso, cantidad_viajeros } =
    req.body;
  const fecha_egreso_set = new Date(fecha_egreso);
  const fecha_ingreso_set = new Date(fecha_ingreso);
  if (fecha_ingreso_set >= fecha_egreso_set) {
    return res
      .status(400)

      .json({ error: "La fecha de ingreso debe ser menor a la de egreso" });
  }
  db.query(
    "SELECT id_usuario,capacidad_max FROM propiedades WHERE id=?",
    [id_propiedad],
    (err, results) => {
      if (err) return next(err);
      if (results.length === 0) {
        return res.status(404).json({ error: "Propiedad no Encontrada" });
      }
      if (results[0].id_usuario === id_usuario) {
        return res
          .status(400)
          .json({ error: "No puedes reservar tu porpia propiedad" });
      }
      if (cantidad_viajeros > results[0].capacidad_max) {
        return res.status(400).json({
          error:
            "La cantidad de viejeros no debe ser mayor a la capacidad maxima",
        });
      }
      db.query(
        "SELECT id FROM reservas WHERE id_propiedad=? AND (fecha_ingreso<= ? AND fecha_egreso>=?)",
        [id_propiedad, fecha_egreso, fecha_ingreso],
        (err2, reservasExistentes) => {
          if (err2) return next(err2);
          if (reservasExistentes.length > 0) {
            return res.status(400).json({
              error:
                "Las fechas no estan disponibles, elige otro intervalo de fechas",
            });
          }
          db.query(
            "INSERT INTO reservas (id_usuario, id_propiedad, fecha_ingreso, fecha_egreso, cantidad_viajeros) VALUES (?,?,?,?,?)",
            [
              id_usuario,
              id_propiedad,
              fecha_ingreso,
              fecha_egreso,
              cantidad_viajeros,
            ],
            (err3, result3) => {
              if (err3) return next(err3);
              res
                .status(201)
                .json({ message: "reserva Creada", id: result3.insertId });
            },
          );
        },
      );
    },
  );
};
const getMisReservas = async (req, res, next) => {
  const id_usuario = req.usuario.id;
  db.query(
    "SELECT reservas.id,reservas.id_usuario,propiedades.titulo,propiedades.ubicacion, reservas.id_propiedad, reservas.fecha_ingreso, reservas.fecha_egreso, reservas.cantidad_viajeros FROM reservas JOIN propiedades ON reservas.id_propiedad=propiedades.id WHERE reservas.id_usuario=?",
    [id_usuario],
    (err, results) => {
      if (err) return next(err);
      res.status(200).json(results);
    },
  );
};
const getMisPropiedades = async (req, res, next) => {
  const id_usuario = req.usuario.id;
  db.query(
    "SELECT reservas.id,reservas.fecha_ingreso, reservas.fecha_egreso, reservas.cantidad_viajeros,propiedades.titulo,propiedades.ubicacion,usuarios.nombre,usuarios.apellido FROM reservas JOIN propiedades ON reservas.id_propiedad=propiedades.id JOIN usuarios ON reservas.id_usuario=usuarios.id WHERE propiedades.id_usuario=?",
    [id_usuario],
    (err, results) => {
      if (err) return next(err);
      res.status(200).json(results);
    },
  );
};
const cancelarReserva = async (req, res, next) => {
  const id_usuario = req.usuario.id;
  const id = req.params.id;
  db.query(
    "SELECT reservas.*, propiedades.id_usuario AS id_anfitrion FROM reservas JOIN propiedades ON reservas.id_propiedad=propiedades.id WHERE reservas.id=?",
    [id],
    (err, results) => {
      if (err) return next(err);
      const reserva = results[0];
      const esHuesped = reserva.id_usuario === id_usuario;
      const esAnfitrion = reserva.id_anfitrion === id_usuario;
      if (!esHuesped && !esAnfitrion) {
        return res.status(403).json({
          error: "Debes ser anfitrion o huesped para eliminar reservas",
        });
      }
      const hoy = new Date();
      const ingreso = new Date(reserva.fecha_ingreso);
      const calculoCancelacion = 1000 * 60 * 60 * 24;
      const diasRestantes = (ingreso - hoy) / calculoCancelacion;
      if (diasRestantes <= 3) {
        return res.status(400).json({
          error:
            "No se puede Cancelar, debido a que quedan pocos dias para efectuar la reserva",
        });
      }
      db.query("DELETE FROM reservas WHERE id=?", [id], (err4, result) => {
        if (err4) return next(err4);
        res.status(201).json({ message: "Reserva Cancelada Correctamente" });
      });
    },
  );
};
module.exports = {
  crearReservas,
  getMisReservas,
  getMisPropiedades,
  cancelarReserva,
};
