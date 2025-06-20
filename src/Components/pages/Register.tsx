import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

type FormData = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
  es_anfitrion: boolean;
};

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono || null,
        pass: data.password,
        es_anfitrion: !!data.es_anfitrion,
      });

      const usuario = response.data.usuario;
      toast.success("Cuenta creada exitosamente");

      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Redirige al home con breve pausa
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error: any) {
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error("Error al conectar con el servidor");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear tu cuenta en FailBnB
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tenés una cuenta?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Iniciá sesión
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="nombre"
                placeholder="Tu nombre"
                {...register("nombre", { required: "Este campo es obligatorio" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.nombre && <p className="text-sm text-red-600">{errors.nombre.message}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                id="apellido"
                placeholder="Tu apellido"
                {...register("apellido", { required: "Este campo es obligatorio" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.apellido && (
                <p className="text-sm text-red-600">{errors.apellido.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@mail.com"
                {...register("email", { required: "Este campo es obligatorio" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                id="telefono"
                placeholder="Tu número de contacto"
                {...register("telefono")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                {...register("password", { required: "La contraseña es requerida" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repetí tu contraseña"
                {...register("confirmPassword", { required: "Repetí la contraseña" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* ¿Es anfitrión? */}
            <div className="flex items-center">
              <input
                id="es_anfitrion"
                type="checkbox"
                {...register("es_anfitrion")}
                className="mr-2"
              />
              <label htmlFor="es_anfitrion" className="text-sm text-gray-700">
                Quiero ser Anfitrión
              </label>
            </div>

            {/* Botón */}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Registrarme
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
