// src/pages/Recuperar.tsx
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

type FormData = {
  email: string;
};

function Recuperar() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Simular envío
    Swal.fire({
      title: "Correo enviado",
      text: `Si existe una cuenta asociada a ${data.email}, recibirás un enlace para recuperar tu contraseña.`,
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Recuperar contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Este campo es obligatorio" })}
              placeholder="tu@email.com"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition"
          >
            Enviar instrucciones
          </button>
        </form>
      </div>
    </div>
  );
}

export default Recuperar;
