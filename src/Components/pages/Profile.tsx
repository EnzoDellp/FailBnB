import { useState } from "react";
import Header from "../Header";
import TabReservas from "../perfil/TabReservas";
import TabPropiedades from "../perfil/TabPropiedades";
import TabPerfil from "../perfil/TabPerfil";
import TabAnuncios from "../perfil/TabAnuncios";
function Perfil() {
  const [tab, setTab] = useState("perfil");

  return (
    <>
      <Header />
      <div className="flex justify-center flex-col items-center min-h-screen bg-gray-100 px-4">
        {/* botones del tab */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("perfil")}
            className={`px-4 py-2 font-medium border-b-2 ${tab === "perfil" ? "border-pink-600 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Mis Datos
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${tab === "reservas" ? "border-pink-600 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setTab("reservas")}
          >
            Mis Reservas
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${tab === "propiedades" ? "border-pink-600 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setTab("propiedades")}
          >
            Mis Propiedades
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 ${tab === "anuncios" ? "border-pink-600 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setTab("anuncios")}
          >
            Mis Anuncios
          </button>
          {/* Contnet segun TAB */}
        </div>
        {/* LLamada al componente TabPerfil */}
        {tab === "perfil" && <TabPerfil />}
        {tab === "reservas" && <TabReservas />}
        {tab === "propiedades" && <TabPropiedades />}
        {tab == "anuncios" && <TabAnuncios />}
      </div>
    </>
  );
}

export default Perfil;
