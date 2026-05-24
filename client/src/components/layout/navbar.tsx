import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/transacciones", label: "Transacciones" },
  { to: "/categorias", label: "Categorías" },
  { to: "/presupuestos", label: "Presupuestos" },
  { to: "/reportes", label: "Reportes" },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">💰 Control de Gastos</span>
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm hover:text-indigo-200 transition-colors ${
                location.pathname === link.to ? "font-semibold underline" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-indigo-200">{user?.nombre}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-indigo-900 hover:bg-indigo-800 px-3 py-1 rounded transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};
