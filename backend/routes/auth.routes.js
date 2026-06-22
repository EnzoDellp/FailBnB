const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email Inválido"),
    body("pass").notEmpty().withMessage("La contraseña es requerida"),
  ],
  validate,
  authController.loginUsuario,
);

router.post(
  "/register",
  [
    body("nombre").notEmpty().withMessage("El nombres es Requerido"),
    body("apellido").notEmpty().withMessage("El apellido es Requerido"),
    body("email").isEmail().withMessage("email Inválido"),
    body("pass")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  validate,
  authController.registerUsuario,
);

//debug
router.get("/test", (req, res) => {
  res.send("Ruta funcionando");
});

module.exports = router;
