import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

function TabReservas() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    api.get("/reservas/mis-reservas").then((res) => setReservas(res.data));
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-xl font-semibold mb-4">Mis Reservas</h3>
      {reservas.length === 0 ? (
        <p className="text-gray-500">No tenés reservas aún.</p>
      ) : (
        reservas.map((r: any) => (
          <div
            key={r.id_propiedad + r.fecha_ingreso}
            className="bg-white rounded-xl shadow p-4 mb-3 text-left"
          >
            <p className="font-semibold">{r.titulo}</p>
            <p className="text-sm text-gray-500">{r.ubicacion}</p>
            <p className="text-sm">
              Check-in: {r.fecha_ingreso?.split("T")[0]}
            </p>
            <p className="text-sm">
              Check-out: {r.fecha_egreso?.split("T")[0]}
            </p>
            <p className="text-sm">Viajeros: {r.cantidad_viajeros}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default TabReservas;
