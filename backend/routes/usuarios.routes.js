const express = require("express");
const router = express.Router();
const {
  eliminarUsuario,
  actualizarUsuario,
} = require("../controllers/auth.controller");
const verificarToken = require("../middlewares/auth.middleware");

// Definí la ruta DELETE
router.delete("/:id", verificarToken, eliminarUsuario);

router.put("/:id", verificarToken, actualizarUsuario);

module.exports = router;
