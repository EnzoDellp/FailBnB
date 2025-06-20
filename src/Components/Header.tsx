import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ nombre: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      setUsuario(JSON.parse(user));
    }
  }, []);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
  localStorage.removeItem("usuario");
  setUsuario(null);
  setIsMenuOpen(false);
  toast.info("Sesión cerrada correctamente", {
    position: "top-right",
    autoClose: 2000,
  });
  navigate("/");
};


  const goToLogin = () => {
    navigate("/Login");
    setIsMenuOpen(false);
  };

  const goToRegister = () => {
    navigate("/Register");
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className="flex justify-between items-center bg-verdeFailbnb border-b-2">
        <img className="ml-5 w-28 h-28" src="logo.png" alt="LogoFailBnb" />

        <div className="flex items-center text-white gap-5 relative mr-5" ref={menuRef}>
          <h4
              onClick={goToRegister}
              className="cursor-pointer border border-gray-300 rounded-full px-4 py-2 hover:bg-white hover:text-black transition">
              Conviértete en Anfitrión
          </h4>

          <div className="relative">
            {usuario ? (
              // Avatar de usuario con atributos aria
              <div
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold cursor-pointer"
                onClick={toggleMenu}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                aria-label="Abrir menú de usuario"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleMenu();
                  }
                }}
              >
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>
            ) : (
              // Icono Bars3 si no está logueado con aria
              <Bars3Icon
                className="w-10 h-10 text-white cursor-pointer"
                onClick={toggleMenu}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                aria-label="Abrir menú de opciones"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleMenu();
                  }
                }}
              />
            )}

            {/* Dropdown */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg text-black z-50"
                role="menu"
                aria-label="Menú de usuario"
              >
                {usuario ? (
                  <>
                    <div className="px-4 py-2 border-b text-sm text-gray-700" role="none">
                      Hola, <strong>{usuario.nombre}</strong>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/perfil");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                      role="menuitem"
                    >
                      Mi Perfil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                      role="menuitem"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={goToLogin}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                      role="menuitem"
                    >
                      Iniciar sesión
                    </button>
                    <button
                      onClick={goToRegister}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                      role="menuitem"
                    >
                      Registrarse
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Condición para ocultar CheckIn y CheckOut en /perfil */}
      {location.pathname !== "/perfil" && (
        <div className="flex items-center justify-center gap-5 border-2 p-6 border-gray-200 rounded-full mt-3 w-fit mx-auto font-bold">
          <div>
            <button className="cursor-pointer border border-gray-300 rounded-xl px-4 py-2">
              CheckIn: <span className="font-extralight">¿Cuándo?</span>
            </button>
          </div>

          <div>
            <button className="cursor-pointer border border-gray-300 rounded-xl px-4 py-2">
              CheckOut: <span className="font-extralight">¿Cuándo?</span>
            </button>
          </div>

          <div>
            <label>Viajeros:</label>
            <select className="cursor-pointer border border-gray-300 rounded-xl px-4 py-2">
              <option>¿Cuántos?</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          <div>
            <MagnifyingGlassIcon className="w-10 h-10 cursor-pointer border border-gray-300 rounded-xl p-2" />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
