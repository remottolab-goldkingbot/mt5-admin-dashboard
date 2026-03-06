import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Topbar() {

const { user, logout } = useAuth();
const navigate = useNavigate();

const [onlineUsers, setOnlineUsers] = useState(0);
const [offlineUsers, setOfflineUsers] = useState(0);
const [totalBalance, setTotalBalance] = useState(0);
const [avgDrawdown, setAvgDrawdown] = useState(0);

const handleLogout = () => {
logout();
navigate("/login");
};

useEffect(() => {

```
const fetchStats = async () => {

  try {

    const res = await fetch(import.meta.env.VITE_API_URL + "/licenses");
    const data = await res.json();

    let online = 0;
    let offline = 0;
    let balance = 0;
    let drawdown = 0;

    data.forEach(l => {

      if (l.last_seen) {

        const last = new Date(l.last_seen);
        const now = new Date();
        const diffMinutes = (now - last) / 1000 / 60;

        if (diffMinutes < 5) online++;
        else offline++;

      } else {
        offline++;
      }

      if (l.balance) balance += Number(l.balance);
      if (l.drawdown) drawdown += Number(l.drawdown);

    });

    setOnlineUsers(online);
    setOfflineUsers(offline);
    setTotalBalance(balance);
    setAvgDrawdown(data.length ? drawdown / data.length : 0);

  } catch (err) {
    console.log(err);
  }

};

fetchStats();

const interval = setInterval(fetchStats, 10000);

return () => clearInterval(interval);
```

}, []);

return (

```
<header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">

  <h1 className="text-lg font-semibold">Dashboard</h1>

  <div className="flex items-center gap-8 text-sm font-semibold">

    <div className="flex items-center gap-2 text-green-400">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      EA Online {onlineUsers}
    </div>

    <div className="flex items-center gap-2 text-red-400">
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      EA Offline {offlineUsers}
    </div>

    <div className="flex items-center gap-2 text-yellow-400">
      💰 Balance {totalBalance.toFixed(2)}
    </div>

    <div className="flex items-center gap-2 text-purple-400">
      📉 DD {avgDrawdown.toFixed(2)}%
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
```

);
}

export default Topbar;
