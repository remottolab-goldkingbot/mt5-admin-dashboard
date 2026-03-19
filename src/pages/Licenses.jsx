import { useState, useEffect } from "react";
import { Copy, RotateCcw, Trash2, Ban } from "lucide-react";

export default function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await fetch("https://mt5-license-system-production.up.railway.app/licenses/public/licenses");

        const data = await res.json();

        console.log("🔥 DATA BACKEND:", data);

        // 🔥 CLAVE: soporta ambos formatos
        if (Array.isArray(data)) {
          setLicenses(data);
        } else if (Array.isArray(data.licenses)) {
          setLicenses(data.licenses);
        } else {
          console.error("Formato inesperado:", data);
          setLicenses([]);
        }

      } catch (error) {
        console.error("❌ Error loading licenses:", error);
        alert("Error conectando con backend");
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  const getStatus = (lastSeen) => {
    if (!lastSeen) return { label: "Offline", color: "bg-red-600" };

    const diff = (Date.now() - new Date(lastSeen)) / 1000;

    if (diff < 60) return { label: "Online", color: "bg-green-600" };
    if (diff < 300) return { label: "Inactivo", color: "bg-yellow-500" };

    return { label: "Offline", color: "bg-red-600" };
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    alert("Licencia copiada");
  };

  if (loading) {
    return <div className="p-6 text-white">Cargando licencias...</div>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Licencias</h1>

      {/* DEBUG TEMPORAL */}
      {/* <pre>{JSON.stringify(licenses, null, 2)}</pre> */}

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-3 text-left">Key</th>
              <th className="p-3">Cuenta</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Profit</th>
              <th className="p-3">DD</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {licenses.map((lic) => {
              const status = getStatus(lic.last_seen);

              return (
                <tr key={lic.id} className="border-b border-gray-800">
                  <td className="p-3 flex items-center gap-2">
                    {lic.license_key}
                    <button onClick={() => copyKey(lic.license_key)}>
                      <Copy size={14} />
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    {lic.account_number || "-"}
                  </td>

                  <td className="p-3 text-center">
                    {lic.balance != null
                      ? `$${Number(lic.balance).toFixed(2)}`
                      : "-"}
                  </td>

                  <td
                    className={`p-3 text-center ${
                      lic.profit > 0
                        ? "text-green-400"
                        : lic.profit < 0
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {lic.profit != null
                      ? `$${Number(lic.profit).toFixed(2)}`
                      : "0.00"}
                  </td>

                  <td className="p-3 text-center">
                    {lic.drawdown != null ? `${lic.drawdown}%` : "-"}
                  </td>

                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs text-white ${status.color}`}>
                      {status.label}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button className="bg-blue-600 p-2 rounded hover:bg-blue-700">
                      <RotateCcw size={14} />
                    </button>

                    <button className="bg-yellow-600 p-2 rounded hover:bg-yellow-700">
                      <Ban size={14} />
                    </button>

                    <button className="bg-red-600 p-2 rounded hover:bg-red-700">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {licenses.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No hay licencias
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}