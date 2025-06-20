const express = require("express");
const router = express.Router();
const { eliminarUsuario, actualizarUsuario } = require("../controllers/auth.controller");

// Definí la ruta DELETE
router.delete("/:id", eliminarUsuario);

router.put("/:id", actualizarUsuario);

module.exports = router;
