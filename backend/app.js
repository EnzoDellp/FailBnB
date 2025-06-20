const express = require("express");
const cors = require("cors");

const reservasRoutes = require("./routes/reservas.routes");
const propiedadesRoutes = require("./routes/propiedades.routes");
const authRoutes = require("./routes/auth.routes");
const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use("/api/reservas", reservasRoutes);
app.use("/api/propiedades", propiedadesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);  // <-- Agregar esta línea

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
