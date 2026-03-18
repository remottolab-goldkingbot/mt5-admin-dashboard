import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  KeyRound,
  ChevronDown
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const isLicensesRoute =
    location.pathname.startsWith("/licenses") ||
    location.pathname.startsWith("/license-plans");

  // 🔥 Se abre si estás dentro, pero luego puedes controlarlo
  const [open, setOpen] = useState(isLicensesRoute);

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5 text-white">
      <h2 className="text-2xl font-bold mb-10 text-blue-500">
        AdminPanel
      </h2>

      <nav className="space-y-3">

        {/* DASHBOARD */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        {/* LICENCIAS */}
        <div>
          <button
            onClick={() => setOpen(!open)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 ${
              isLicensesRoute
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <KeyRound size={18} />
              Licencias
            </div>

            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* SUBMENÚ */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open ? "max-h-40 mt-2" : "max-h-0"
            }`}
          >
            <div className="ml-6 space-y-2 border-l border-gray-700 pl-4">

              <NavLink
                to="/licenses"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-800 text-gray-400"
                  }`
                }
              >
                Todas
              </NavLink>

              <NavLink
                to="/license-plans"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-800 text-gray-400"
                  }`
                }
              >
                Planes
              </NavLink>

            </div>
          </div>
        </div>

      </nav>
    </aside>
  );
}

export default Sidebar;