import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import type { NuevaPropiedadPayload } from "../../types/index";
import Header from "../Header";

function CrearPropiedad() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NuevaPropiedadPayload>();

  const onSubmit = async (data: NuevaPropiedadPayload) => {
    const user = JSON.parse(localStorage.getItem("usuario") || "{}");
    const id_usuario = user?.id;

    if (!id_usuario) {
      toast.error("Error: No se encontró usuario logueado.");
      return;
    }

    if (imagenes.length === 0) {
      toast.warning("Debes subir al menos una imagen");
      return;
    }

    try {
      const payload: NuevaPropiedadPayload = {
        ...data,
        id_usuario,
        imagenes,
      };

      await api.post("/propiedades", payload);
      toast.success("Propiedad creada exitosamente");
      navigate("/");
    } catch (error: any) {
      const mensaje = error.response?.data?.error;
      toast.error(mensaje || "Error al crear propiedad");
      console.error(error);
    }
  };
  //imagenes
  const [imagenes, setImagenes] = useState<string[]>([]);
  //convertirlas a base64
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      toast.warning("Solo puedes subir hasta 3 imágenes");
      return;
    }

    try {
      const compressedPromises = files.map(async (file) => {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.3, // Máximo 300KB
          maxWidthOrHeight: 1024, // Reduce resolución si es muy alta
          useWebWorker: true,
        });

        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(compressedFile);
        });
      });

      const compressedBase64Imgs = await Promise.all(compressedPromises);
      setImagenes(compressedBase64Imgs);
      toast.success("Imágenes comprimidas y cargadas");
    } catch (error) {
      console.error("Error al comprimir imagenes", error);
      toast.error("Error al comprimir las imágenes");
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Publicar una Propiedad
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w">
            Completa los datos del alojamiento
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  {...register("titulo", { required: "Título requerido" })}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {errors.titulo && (
                  <p className="text-red-600 text-sm">
                    {errors.titulo.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  {...register("descripcion")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  {...register("direccion", {
                    required: "Dirección requerida",
                  })}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {errors.direccion && (
                  <p className="text-red-600 text-sm">
                    {errors.direccion.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <input
                  {...register("ubicacion", {
                    required: "Ubicación requerida",
                  })}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {errors.ubicacion && (
                  <p className="text-red-600 text-sm">
                    {errors.ubicacion.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Habitaciones
                </label>
                <input
                  type="number"
                  {...register("cant_habitaciones", { required: true, min: 1 })}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {errors.cant_habitaciones && (
                  <p className="text-red-600 text-sm">
                    {errors.cant_habitaciones.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Baños
                </label>
                <input
                  type="number"
                  {...register("cant_baños", { required: true, min: 1 })}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {errors.cant_baños && (
                  <p className="text-red-600 text-sm">
                    {errors.cant_baños.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacidad Máxima
                </label>
                <input
                  type="number"
                  {...register("capacidad_max", { required: true, min: 1 })}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {errors.capacidad_max && (
                  <p className="text-red-600 text-sm">
                    {errors.capacidad_max.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Precio por Noche
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("precio_noche", { required: true, min: 0 })}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {errors.precio_noche && (
                  <p className="text-red-600 text-sm">
                    {errors.precio_noche.message}
                  </p>
                )}
              </div>
              {/* Fechas */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disponible desde:
                </label>
                <input
                  type="date"
                  {...register("fecha_inicio_disponibilidad", {
                    required: "Fecha de inicio requerida",
                  })}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {errors.fecha_inicio_disponibilidad?.message && (
                  <p className="text-red-600 text-sm">
                    {errors.fecha_inicio_disponibilidad.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disponible Hasta:
                </label>
                <input
                  type="date"
                  {...register("fecha_fin_disponibilidad", {
                    required: "Fecha de fin requerida",
                  })}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {errors.fecha_fin_disponibilidad?.message && (
                  <p className="text-red-600 text-sm">
                    {errors.fecha_fin_disponibilidad.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Imágenes (la primera será la portada)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                {imagenes.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {imagenes.length} imagen(es) seleccionada(s)
                  </p>
                )}
                {errors.imagenes && (
                  <p className="text-red-600 text-sm">
                    {errors.imagenes.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Publicar Propiedad
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrearPropiedad;
