import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

type FormData = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
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
      await axios.post("http://localhost:3000/api/auth/register", {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        pass: data.password,
      });

      toast.success("Cuenta creada exitosamente");
      window.location.href = "/login";
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
                type="text"
                placeholder="Tu nombre"
                {...register("nombre", { required: "Este campo es obligatorio" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                placeholder="Tu apellido"
                {...register("apellido", { required: "Este campo es obligatorio" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
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
                placeholder="Tu dirección Email"
                {...register("email", { required: "Este campo es obligatorio" })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Botón */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
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
