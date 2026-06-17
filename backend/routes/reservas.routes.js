const express = require("express");
const verificarToken = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", verificarToken, (req, res) => {
  res.send("Ruta de reservas funcionando");
});

module.exports = router;
