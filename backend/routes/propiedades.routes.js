const express = require("express");
const router = express.Router();
const propiedadesController = require("../controllers/propiedades.controller");
const verificarToken = require("../middlewares/auth.middleware");

// Listar Propiedades
router.get("/", propiedadesController.getAllpropiedades);

// Crear nueva Propiedad
router.post("/", verificarToken, propiedadesController.createPropiedad);
//Filtro
router.get("/disponibles", propiedadesController.buscarPropiedadesDisponibles);
// Obtener imágenes de una Propiedad por ID
router.get("/filtrar", propiedadesController.filtrarPropiedades);
// Obtener una Propiedad por ID
router.get("/:id", propiedadesController.getPropiedadById);

// Actualizar una Propiedad por ID
router.put("/:id", verificarToken, propiedadesController.updatePropiedad);

// Eliminar una Propiedad por ID
router.delete("/:id", verificarToken, propiedadesController.deletePropiedad);

module.exports = router;
