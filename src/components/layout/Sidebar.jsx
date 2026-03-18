import { NavLink, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const isLicensesOpen =
    location.pathname.startsWith("/licenses") ||
    location.pathname.startsWith("/license-plans");

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5">
      <h2 className="text-2xl font-bold mb-10 text-blue-500">
        AdminPanel
      </h2>

      <nav className="space-y-3">
        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`
          }
        >
          Dashboard
        </NavLink>

        {/* LICENCIAS */}
        <div>
          <p className="text-gray-400 text-sm px-2 mt-4 mb-2">
            Licencias
          </p>

          <div className="space-y-2">
            <NavLink
              to="/licenses"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              Todas
            </NavLink>

            <NavLink
              to="/license-plans"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              Planes
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;