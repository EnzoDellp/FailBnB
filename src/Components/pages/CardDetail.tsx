import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Header from "../Header";
import { toast } from "react-toastify";

function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const [propiedad, setPropiedad] = useState<any>(null);
  const [usuario, setUsuario] = useState<{ nombre: string } | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");
  const viajeros = searchParams.get("viajeros");

  // Recuperar usuario del localStorage
  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      setUsuario(JSON.parse(user));
    }
  }, []);

  // Obtener propiedad por id
  useEffect(() => {
    if (!id) return;

    api
      .get(`http://localhost:3000/api/propiedades/${id}`)
      .then((res) => setPropiedad(res.data))
      .catch((err) => console.error("Error al obtener propiedad:", err));
  }, [id]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "--/--/----";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Función para manejar click en reservar
  const handleReservar = () => {
    if (usuario) {
      toast.success("Reservando...");
      // Aquí podés redirigir o mostrar modal de reserva
    } else {
      toast.warning("Debes iniciar sesión para reservar");
      navigate("/Login");
    }
  };

  if (!propiedad) {
    return <div className="text-center mt-10 text-gray-500">Cargando...</div>;
  }

  const {
    titulo,
    descripcion,
    cant_habitaciones,
    cant_baños,
    capacidad_max,
    precio_noche,
    imagenes = [],
  } = propiedad;

  const portada = imagenes[0] || "/img/default.jpg";

  return (
    <>
      <div>
        <Header />

        <div className="bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl pb-3 text-center">{titulo}</h1>
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={portada}
                    alt="Portada"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-2">{titulo}</h2>
          <p className="text-gray-600 mb-1">
            {capacidad_max} huéspedes &bull; {cant_habitaciones} habitaciones
            &bull; {cant_baños} baños
          </p>
          <p className="text-gray-700 leading-relaxed">{descripcion}</p>
        </div>

        {/* Sección anfitrión + reserva */}
        <div className="max-w-4xl mx-auto px-4 pb-8 grid md:grid-cols-3 gap-6 items-start">
          <div className="col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-pink-600 font-bold text-xl shadow">
                {propiedad.anfitrion?.nombre?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h4 className="text-lg font-semibold">
                  {propiedad.anfitrion?.nombre} {propiedad.anfitrion?.apellido}
                </h4>
                <p className="text-gray-500 text-sm">
                  Miembro desde{" "}
                  {new Date(
                    propiedad.anfitrion.fecha_registro,
                  ).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario reserva */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border">
            <p className="text-xl font-semibold mb-2">
              ${precio_noche}{" "}
              <span className="text-sm font-normal text-gray-500">
                por noche
              </span>
            </p>
            <div className="border rounded-lg overflow-hidden mb-4">
              <div className="grid grid-cols-2 divide-x">
                <div className="p-2">
                  <p className="text-xs text-gray-500">Check-In</p>
                  <p className="text-sm font-medium">{formatDate(checkin)}</p>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500">Check-Out</p>
                  <p className="text-sm font-medium">{formatDate(checkout)}</p>
                </div>
              </div>
              <div className="border-t p-2">
                <p className="text-xs text-gray-500">Viajeros</p>
                <p className="text-sm font-medium">{viajeros || "--"}</p>
              </div>
            </div>

            <button
              onClick={handleReservar}
              className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-oliva text-sm transition duration-300"
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardDetail;
