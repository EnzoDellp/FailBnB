import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";
import Card from "../Card";
import type { PropiedadFromDB } from "../../types/index";
import Header from "../Header";
import SearchFilter from "../SearchFilter";

function FilterResponse() {
  const [searchParams] = useSearchParams();
  const [resultados, setResultados] = useState<PropiedadFromDB[]>([]);
  const [loading, setLoading] = useState(true);

  const ubicacion = searchParams.get("ubicacion") || "";
  const checkin = searchParams.get("checkin") || "";
  const checkout = searchParams.get("checkout") || "";
  const viajeros = searchParams.get("viajeros") || "";

  useEffect(() => {
    const fetchResultados = async () => {
      if (!ubicacion || !checkin || !checkout || !viajeros) {
        toast.error("Faltan campos para realizar la bÃºsqueda.");
        setLoading(false);
        return;
      }

      if (new Date(checkin) > new Date(checkout)) {
        toast.error("La fecha de entrada debe ser anterior a la de salida.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get<PropiedadFromDB[]>(
          "http://localhost:3000/api/propiedades/filtrar",
          {
            params: {
              ubicacion,
              checkin,
              checkout,
              viajeros,
            },
          },
        );
        setResultados(res.data);
      } catch (error) {
        toast.error("Error al obtener propiedades filtradas");
        console.error("Error al filtrar propiedades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [ubicacion, checkin, checkout, viajeros]);

  if (loading) {
    return <p className="text-center mt-10">Cargando resultados...</p>;
  }

  return (
    <>
      <Header />
      <SearchFilter />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Resultados en "{ubicacion}" para {viajeros} viajero(s)
        </h1>

        {resultados.length === 0 ? (
          <p className="text-center text-gray-600">
            No se encontraron propiedades disponibles con esos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((prop) => (
              <Card
                key={prop.id}
                id={prop.id}
                ubicacion={prop.ubicacion}
                titulo={prop.titulo}
                imagen={prop.portada}
                precio={prop.precio_noche}
                camas={prop.cant_habitaciones}
                banios={prop.cant_baños}
                calificacion={5}
                popular={false}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FilterResponse;

