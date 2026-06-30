import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";
import type { ReservaProps } from "../../types";
function TabReservas() {
  const [reservas, setReservas] = useState<ReservaProps[]>([]);

  useEffect(() => {
    api.get("/reservas/mis-reservas").then((res) => setReservas(res.data));
  }, []);
  const handleCancelar = async (id: number) => {
    try {
      await api.delete(`/reservas/${id}`);
      toast.success("Reserva cancelada");
      // actualizar la lista sin hacer otra petición al backend:
      setReservas((prev: ReservaProps[]) =>
        prev.filter((r: ReservaProps) => r.id !== id),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al cancelar");
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-xl font-semibold mb-4">Mis Reservas</h3>

      {reservas.length === 0 ? (
        <p className="text-gray-500">No tenés reservas aún.</p>
      ) : (
        reservas.map((r: ReservaProps) => (
          <div key={r.id_propiedad + r.fecha_ingreso}>
            <div className="bg-white rounded-xl shadow p-4 mb-3 flex-1  items-center">
              <p className="font-semibold">{r.titulo}</p>
              <p className="text-sm text-gray-500">{r.ubicacion}</p>
              <p className="text-sm">
                Check-in: {r.fecha_ingreso?.split("T")[0]}
              </p>
              <p className="text-sm">
                Check-out: {r.fecha_egreso?.split("T")[0]}
              </p>
              <p className="text-sm">Viajeros: {r.cantidad_viajeros}</p>
              <button
                className="bg-pink-600 text-white p-3 rounded-xl shadow mt-2"
                onClick={() => handleCancelar(r.id)}
              >
                Cancelar Reserva
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TabReservas;
