import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import type { PropiedadesProps } from "../../types";
function TabPropiedades() {
  const [misPropiedades, SetMisPropiedades] = useState<PropiedadesProps[]>([]);
  useEffect(() => {
    api
      .get("/reservas/mis-propiedades")
      .then((res) => SetMisPropiedades(res.data));
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-xl font-semibold mb-4">
        {" "}
        Mis Propiedades Reservadas
      </h3>
      {misPropiedades.length == 0 ? (
        <p className="text-gray-500">No Tenes Propiedades Aún.</p>
      ) : (
        misPropiedades.map((r: PropiedadesProps) => {
          const dias = Math.round(
            (new Date(r.fecha_egreso).getTime() -
              new Date(r.fecha_ingreso).getTime()) /
              (1000 * 60 * 60 * 24),
          );
          const total = Number(r.precio_noche) * dias;
          return (
            <div
              key={r.id}
              className="bg-white rounded-xl shadow p-4 mb-3 text-left"
            >
              <p>
                Titulo de la Propiedad:{" "}
                <span className="font-semibold">{r.titulo}</span>
              </p>
              <p>
                {" "}
                Apellido del Huesped:{" "}
                <span className="font-semibold">{r.apellido}</span>
              </p>
              <p>
                Nombre del Huesped:{" "}
                <span className="font-semibold">{r.nombre}</span>
              </p>
              <p>
                Ubicacion de tu Propiedad:{" "}
                <span className="font-semibold">{r.ubicacion}</span>
              </p>
              <p>
                Fecha de CheckIn:{" "}
                <span className="font-semibold text-pink-600">
                  {new Date(r.fecha_ingreso).toLocaleDateString("es-AR")}
                </span>
              </p>
              <p>
                Fecha de CheckOut:{" "}
                <span className="font-semibold text-pink-600 ">
                  {new Date(r.fecha_egreso).toLocaleDateString("es-AR")}
                </span>
              </p>
              <p className="text-sm font-bold semibold text-green-600">
                Ganancia: ${r.precio_noche} x {dias} días = ${total}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default TabPropiedades;
