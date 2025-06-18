const db = require("../models/db");
const bcrypt = require("bcrypt");

const loginUsuario = (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const query = "SELECT * FROM usuarios WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = results[0];

    // Si la contraseña está en texto plano (solo para testeo temporal):
    if (usuario.pass === pass) {
      return res.json({
        message: "Login exitoso",
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      });
    }

    // Comparar contraseña hasheada (usar esto con bycrypt):
    const match = await bcrypt.compare(pass, usuario.pass);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login exitoso",
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  });
};





const registerUsuario = async (req, res) => {
  const { nombre, apellido, email, pass } = req.body;

  if (!nombre || !apellido || !email || !pass) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    // Verificamos si ya existe el usuario
    const queryCheck = "SELECT * FROM usuarios WHERE email = ?";
    db.query(queryCheck, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });
      if (results.length > 0) {
        return res.status(409).json({ error: "El usuario ya existe" });
      }

      // Hashear la contraseña
      const hashedPass = await bcrypt.hash(pass, 10);

      const insertQuery =
        "INSERT INTO usuarios (nombre, apellido, email, pass) VALUES (?, ?, ?, ?)";
      db.query(
        insertQuery,
        [nombre, apellido, email, hashedPass],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Error al registrar usuario" });

          res.status(201).json({
            message: "Usuario registrado con éxito",
            usuario: { id: result.insertId, nombre, apellido, email },
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};



module.exports = { loginUsuario, registerUsuario };
