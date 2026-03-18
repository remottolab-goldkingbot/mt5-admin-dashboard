import { NavLink, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const isLicensesSectionActive =
    location.pathname.startsWith("/licenses") ||
    location.pathname.startsWith("/license-plans");

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5">
      <h2 className="text-2xl font-bold mb-10 text-blue-500">
        AdminPanel
      </h2>

      <nav className="space-y-3">
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

        <div>
          <div
            className={`block px-4 py-2 rounded-lg transition ${
              isLicensesSectionActive
                ? "text-white"
                : "text-gray-300"
            }`}
          >
            Licencias
          </div>

          <div className="mt-2 ml-4 space-y-2 border-l border-gray-700 pl-4">
            <NavLink
              to="/licenses"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg transition ${
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
                `block px-3 py-2 rounded-lg transition ${
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