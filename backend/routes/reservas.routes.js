const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate.middleware");
const reservasController = require("../controllers/reservas.controller");
const verificarToken = require("../middlewares/auth.middleware");

router.post("/", verificarToken, reservasController.crearReservas);
router.get("/mis-reservas", verificarToken, reservasController.getMisReservas);
router.get(
  "/mis-propiedades",
  verificarToken,
  reservasController.getMisPropiedades,
);
router.delete("/:id", verificarToken, reservasController.cancelarReserva);
module.exports = router;
