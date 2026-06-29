import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";
import swal from "sweetalert2";

export default function TabAnuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [anuncioSelecionado, setAnuncioSelecionado] = useState<any>(null);
  useEffect(() => {
    api.get("/propiedades/mis-anuncios").then((res) => setAnuncios(res.data));
  }, []);
  const handleEliminar = async (id: number) => {
    const result = await swal.fire({
      title: "¿Estás Seguro?",
      text: "Esta acción eliminará tu propiedad permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/propiedades/${id}`);
        toast.success("Propiedad eliminada");
        setAnuncios((prev: any) => prev.filter((a: any) => a.id !== id));
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Error al eliminar");
      }
    }
  };
  const handleGuardar = async () => {
    try {
      await api.put(
        `/propiedades/${anuncioSelecionado.id}`,
        anuncioSelecionado,
      );
      toast.success("Anuncio Actualizado");
      setAnuncios((prev: any) =>
        prev.map((a: any) =>
          a.id === anuncioSelecionado.id ? anuncioSelecionado : a,
        ),
      );
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al actualizar");
    }
  };
  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-xl font-semibold mb-4 ">Mis Anuncios</h3>
      {anuncios.length === 0 ? (
        <p className="text-gray-500">No tienes propiedaes Publicadas</p>
      ) : (
        anuncios.map((a: any) => (
          <div
            key={a.id}
            className="bg-white rounded-xl shadow p-4 mb-3 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{a.titulo}</p>
              <p className="text-sm text-gray-500">{a.ubicacion}</p>
              <p className="text-sm">
                ${a.precio_noche}/noche · {a.capacidad_max}Personas
              </p>
            </div>
            <button
              onClick={() => handleEliminar(a.id)}
              className="px-3 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700"
            >
              Eliminar Anuncio
            </button>
            <button
              onClick={() => {
                setAnuncioSelecionado(a);
                setModalOpen(true);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 mr-2"
            >
              Editar Anuncio
            </button>
          </div>
        ))
      )}
      {isModalOpen && anuncioSelecionado && (
        <div className="fixed inset-0 bg-opacity-40 bg-black flex  justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Editar Anuncio</h3>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 ">
                Titulo
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={anuncioSelecionado.titulo}
                onChange={(e) =>
                  setAnuncioSelecionado({
                    ...anuncioSelecionado,
                    titulo: e.target.value,
                  })
                }
                placeholder="titulo"
              />
              <label className="text-sm font-medium text-gray-700 ">
                Ubicacion
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={anuncioSelecionado.ubicacion}
                onChange={(e) =>
                  setAnuncioSelecionado({
                    ...anuncioSelecionado,
                    ubicacion: e.target.value,
                  })
                }
                placeholder="ubicacion"
              />
              <label className="text-sm font-medium text-gray-700 ">
                Precio por Noche
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={anuncioSelecionado.precio_noche}
                onChange={(e) =>
                  setAnuncioSelecionado({
                    ...anuncioSelecionado,
                    precio_noche: e.target.value,
                  })
                }
                placeholder="Precio por Noche"
              />
              <label className="text-sm font-medium text-gray-700 ">
                Capacidad Máxima
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-1"
                value={anuncioSelecionado.capacidad_max}
                onChange={(e) =>
                  setAnuncioSelecionado({
                    ...anuncioSelecionado,
                    capacidad_max: e.target.value,
                  })
                }
                placeholder="Capacidad Máxima"
              />
              <label className="text-sm font-medium text-gray-700 ">
                Descripción
              </label>
              <textarea
                className="w-full border rounded px-3 py-1"
                value={anuncioSelecionado.descripcion}
                onChange={(e) =>
                  setAnuncioSelecionado({
                    ...anuncioSelecionado,
                    descripcion: e.target.value,
                  })
                }
                placeholder="Descripción"
              />

              <label className="text-sm font-medium text-gray-700 ">
                Cantidad de Habitaciones
              </label>
              <input
                className="w-full border rounded px-3 py-1"
                type="number"
                value={anuncioSelecionado.cant_habitaciones}
                onChange={(e) =>
                  setAnuncioSelecionado({
                    ...anuncioSelecionado,
                    cant_habitaciones: e.target.value,
                  })
                }
                placeholder="Cantidad Habitaciones"
              />
              <label className="text-sm font-medium text-gray-700 ">
                Capacidad de Baños
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-1"
                value={anuncioSelecionado.cant_baños}
                onChange={(e) =>
                  setAnuncioSelecionado({
                    ...anuncioSelecionado,
                    cant_baños: e.target.value,
                  })
                }
                placeholder="Cantidad de Baños"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
