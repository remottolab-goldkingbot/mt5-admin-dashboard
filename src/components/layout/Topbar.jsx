import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {user?.email || "Admin"}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
