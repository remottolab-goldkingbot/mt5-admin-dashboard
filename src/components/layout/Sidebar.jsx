import { NavLink } from "react-router-dom";

function Sidebar() {
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
      </nav>
    </aside>
  );
}

export default Sidebar;
