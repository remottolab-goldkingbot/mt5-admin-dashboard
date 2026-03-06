import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Topbar() {

const { user, logout } = useAuth();
const navigate = useNavigate();

const [onlineUsers, setOnlineUsers] = useState(0);
const [offlineUsers, setOfflineUsers] = useState(0);

const API_URL = import.meta.env.VITE_API_URL;

const handleLogout = () => {
logout();
navigate("/login");
};

useEffect(() => {

```
const fetchStats = async () => {

  try {

    const token = localStorage.getItem("token");

    const response = await fetch(API_URL + "/licenses", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await response.json();

if (!Array.isArray(data)) return;

    let online = 0;
    let offline = 0;

    data.forEach((license) => {

      if (license.last_seen) {

        const last = new Date(license.last_seen);
        const now = new Date();

        const diffMinutes = (now - last) / 1000 / 60;

        if (diffMinutes < 5) online++;
        else offline++;

      } else {
        offline++;
      }

    });

    setOnlineUsers(online);
    setOfflineUsers(offline);

  } catch (error) {

    console.log("Topbar stats error:", error);

  }

};

fetchStats();

const interval = setInterval(fetchStats, 10000);

return () => clearInterval(interval);
```

}, [API_URL]);

return ( <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">

```
  <h1 className="text-lg font-semibold">Dashboard</h1>

  <div className="flex items-center gap-6">

    <div className="flex items-center gap-2 text-green-400 text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      {onlineUsers}
    </div>

    <div className="flex items-center gap-2 text-red-400 text-sm">
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      {offlineUsers}
    </div>

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
