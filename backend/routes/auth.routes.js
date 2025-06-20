const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.loginUsuario);
router.post("/register", authController.registerUsuario);

//debug
router.get("/test", (req, res) => {
  res.send("Ruta funcionando");
});
module.exports = router;
