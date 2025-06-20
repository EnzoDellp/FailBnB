import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Header from "../Header";

function Perfil() {
  const [usuario, setUsuario] = useState<{
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string | null;
    es_anfitrion: boolean;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    es_anfitrion: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("usuario");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUsuario(user);
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        telefono: user.telefono || "",
        es_anfitrion: user.es_anfitrion || false,
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!usuario) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditar = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Opcional: resetear formData a usuario para descartar cambios
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        es_anfitrion: usuario.es_anfitrion || false,
      });
    }
  };

  const handleSave = async () => {
    // Validación simple:
    if (!formData.nombre || !formData.apellido || !formData.email) {
      toast.error("Nombre, apellido y email son obligatorios");
      return;
    }

    try {
      const updatedUser = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono || null,
        es_anfitrion: formData.es_anfitrion,
      };

      await axios.put(`http://localhost:3000/api/usuarios/${usuario.id}`, updatedUser);

      // Actualizar estado y localStorage:
      const newUser = { ...usuario, ...updatedUser };
      setUsuario(newUser);
      localStorage.setItem("usuario", JSON.stringify(newUser));

      toast.success("Perfil actualizado correctamente");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error al actualizar perfil");
    }
  };

  const handleEliminar = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará tu cuenta permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/usuarios/${usuario.id}`);
        toast.success("Cuenta eliminada correctamente");
        localStorage.removeItem("usuario");
        navigate("/");
      } catch (error: any) {
        toast.error("Error al eliminar la cuenta");
      }
    }
  };

  return (

    <>
    <Header />
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center relative">
              {/* Avatar inicial */}
              <div className="w-24 h-24 mx-auto rounded-full bg-pink-600 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
                  {usuario.nombre.charAt(0).toUpperCase()}
              </div>

              {/* Título */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                  {usuario.nombre} {usuario.apellido}
              </h2>
              <p className="text-sm text-gray-500 mb-6">{usuario.email}</p>

              {/* Info */}
              <div className="text-left space-y-4 mb-6">
                  <div>
                      <p className="text-sm text-gray-500">Nombre</p>
                      <p className="text-lg font-medium text-gray-800">{usuario.nombre}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-500">Apellido</p>
                      <p className="text-lg font-medium text-gray-800">{usuario.apellido}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium text-gray-800">{usuario.email}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="text-lg font-medium text-gray-800">{usuario.telefono || "-"}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-500">Anfitrión</p>
                      <p className="text-lg font-medium text-gray-800">{usuario.es_anfitrion ? "Sí" : "No"}</p>
                  </div>
              </div>

              {/* Botones */}
              <div className="flex justify-center gap-4">
                  <button
                      onClick={handleEditar}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  >
                      <PencilIcon className="w-5 h-5" />
                      Editar Perfil
                  </button>
                  <button
                      onClick={handleEliminar}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                  >
                      <TrashIcon className="w-5 h-5" />
                      Eliminar Cuenta
                  </button>
              </div>

              {/* Modal de edición */}
              {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                          <button
                              onClick={handleCloseModal}
                              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                              aria-label="Cerrar modal"
                          >
                              <XMarkIcon className="w-6 h-6" />
                          </button>
                          <h3 className="text-xl font-semibold mb-4">Editar Perfil</h3>
                          <form
                              onSubmit={(e) => {
                                  e.preventDefault();
                                  handleSave();
                              } }
                              className="space-y-4"
                          >
                              <div>
                                  <label htmlFor="nombre" className="flex text-sm font-medium text-gray-700">
                                      Nombre
                                  </label>
                                  <input
                                      id="nombre"
                                      name="nombre"
                                      type="text"
                                      value={formData.nombre}
                                      onChange={handleInputChange}
                                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                      required />
                              </div>

                              <div>
                                  <label htmlFor="apellido" className="flex text-sm font-medium text-gray-700">
                                      Apellido
                                  </label>
                                  <input
                                      id="apellido"
                                      name="apellido"
                                      type="text"
                                      value={formData.apellido}
                                      onChange={handleInputChange}
                                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                      required />
                              </div>

                              <div>
                                  <label htmlFor="email" className="flex text-sm font-medium text-gray-700">
                                      Email
                                  </label>
                                  <input
                                      id="email"
                                      name="email"
                                      type="email"
                                      value={formData.email}
                                      onChange={handleInputChange}
                                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                      required />
                              </div>

                              <div>
                                  <label htmlFor="telefono" className="flex text-sm font-medium text-gray-700">
                                      Teléfono
                                  </label>
                                  <input
                                      id="telefono"
                                      name="telefono"
                                      type="text"
                                      value={formData.telefono}
                                      onChange={handleInputChange}
                                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
                              </div>

                              <div className="flex items-center gap-2">
                                  <input
                                      id="es_anfitrion"
                                      name="es_anfitrion"
                                      type="checkbox"
                                      checked={formData.es_anfitrion}
                                      onChange={handleInputChange} />
                                  <label htmlFor="es_anfitrion" className="text-sm text-gray-700">
                                      Quiero ser Anfitrión
                                  </label>
                              </div>

                              <div className="flex justify-end gap-4 mt-6">
                                  <button
                                      type="button"
                                      onClick={handleCloseModal}
                                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                  >
                                      Cancelar
                                  </button>
                                  <button
                                      type="submit"
                                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                  >
                                      Guardar Cambios
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}
          </div>
      </div></>
  );
}

export default Perfil;
