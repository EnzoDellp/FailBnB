import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

function TabPropiedades() {
  const [misPropiedades, SetMisPropiedades] = useState([]);
  useEffect(() => {
    api
      .get("/reservas/mis-propiedades")
      .then((res) => SetMisPropiedades(res.data));
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-xl font-semibold mb-4"> Mis Propiedades</h3>
      {misPropiedades.length == 0 ? (
        <p className="text-gray-500">No Tenes Propiedades Aún.</p>
      ) : (
        misPropiedades.map((r: any) => (
          <div
            key={r.id_propiedad}
            className="bg-white rounded-xl shadow p-4 mb-3 text-left"
          >
            <p className="font-semibold">{r.nombre}</p>
            <p className="font-semibold">{r.apellido}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default TabPropiedades;
