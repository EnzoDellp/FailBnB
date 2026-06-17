const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middlewares/validate.middleware");
const propiedadesController = require("../controllers/propiedades.controller");
const verificarToken = require("../middlewares/auth.middleware");

// Listar Propiedades
router.get("/", propiedadesController.getAllpropiedades);

// Crear nueva Propiedad
router.post(
  "/",
  [
    body("titulo")
      .notEmpty()
      .isLength({ min: 20 })
      .withMessage("El titulo debe tener al menos 20 caracteres"),
    body("descripcion")
      .notEmpty()
      .isLength({ min: 60 })
      .withMessage("La descripcion debe tener al menos 60 caracteres"),
    body("direccion").notEmpty().withMessage("La direccion es Requerida"),
    body("cant_habitaciones")
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage(
        "La cantidad de habitaciones es requerida y debe tener como minimo 1",
      ),
    body("cant_baños")
      .notEmpty()
      .withMessage("La cantidad de baños es requerida")
      .isInt({ min: 1 }),

    body("precio_noche")
      .notEmpty()
      .withMessage("El precio por noche es Requerido")
      .isInt({ min: 1 }),
    body("ubicacion").notEmpty().withMessage("La ubicacion es requerida"),
  ],
  verificarToken,
  validate,
  propiedadesController.createPropiedad,
);
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
