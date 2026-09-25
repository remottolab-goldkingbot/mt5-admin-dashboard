import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Power,
  DollarSign,
  Activity,
  Gauge,
  ShieldCheck,
  Clock,
  Lock,
} from "lucide-react";

const REAL_EA_NAME = "Gold King Bot Miner V1.0";

const PLACEHOLDER_BOTS = [
  {
    name: "Forex Institutional Alpha",
    desc: "Order Blocks institucionales en divisas mayores.",
    accent: "blue",
  },
  {
    name: "Solana Grid Master EA",
    desc: "Grid cuantitativo en Binance/Bybit.",
    accent: "cyan",
  },
];

const ACCENT = {
  amber: { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
  blue: { text: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  cyan: { text: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
};

const PLAN_LABEL = {
  monthly: "Demo 30 Días",
  yearly: "1 Año",
  lifetime: "Vitalicia",
};

function getConnectionStatus(lastSeen) {
  if (!lastSeen) return "Sin conexión";
  const diffMinutes = (new Date() - new Date(lastSeen)) / 1000 / 60;
  return diffMinutes < 5 ? "Conectado" : "Sin conexión";
}

function Bots() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);

  const token = localStorage.getItem("token");

  const fetchLicenses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/licenses/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudieron cargar tus EAs");
      setLicenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const realLicense = licenses.find((l) => l.ea_name === REAL_EA_NAME);

  const toggleRealBot = async () => {
    if (!realLicense) return;
    setToggling(true);
    try {
      const newStatus = realLicense.status === "active" ? "inactive" : "active";
      const res = await fetch(`${import.meta.env.VITE_API_URL}/licenses/my/${realLicense.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo actualizar el EA");

      setLicenses((prev) => prev.map((l) => (l.id === realLicense.id ? data.license : l)));
    } catch (err) {
      setError(err.message);
    } finally {
      setToggling(false);
    }
  };

  // Stats reales derivados de las licencias
  const stats = useMemo(() => {
    const totalEAs = 1 + PLACEHOLDER_BOTS.length; // 1 real + 2 "próximamente"
    const activos = realLicense?.status === "active" ? 1 : 0;
    const profitTotal = licenses.reduce((acc, l) => acc + Number(l.profit || 0), 0);
    const riesgoPromedio = realLicense?.risk_percent ? `${Number(realLicense.risk_percent).toFixed(1)}%` : "—";
    return { totalEAs, activos, profitTotal, riesgoPromedio };
  }, [licenses, realLicense]);

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">Centro de Control de EAs (Robots MT4/MT5)</h2>
        <p className="text-xs text-slate-400">
          Estado en vivo de tus algoritmos vinculados a tu licencia real.
        </p>
      </div>

      {error && <p className="text-rose-400 text-xs font-mono">{error}</p>}

      {/* Barra de stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Total EAs</span>
          <span className="text-xl font-black text-white">{stats.totalEAs}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Activos</span>
          <span className="text-xl font-black text-emerald-400">{stats.activos}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Profit Total</span>
          <span className={`text-xl font-black ${stats.profitTotal >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {stats.profitTotal >= 0 ? "+" : "-"}${Math.abs(stats.profitTotal).toFixed(2)}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Riesgo Promedio</span>
          <span className="text-xl font-black text-amber-400">{stats.riesgoPromedio}</span>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 text-xs font-mono">Cargando tus EAs...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Card real: Gold King Bot Miner V1.0 */}
          <div className={`glass-panel rounded-3xl p-6 border ${ACCENT.amber.border} space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className={`w-4 h-4 ${ACCENT.amber.text}`} />
                <h3 className="font-bold text-white text-sm">{REAL_EA_NAME}</h3>
              </div>
              {realLicense ? (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                    realLicense.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {realLicense.status === "active" ? "ACTIVO" : "APAGADO"}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                  SIN LICENCIA
                </span>
              )}
            </div>

            {!realLicense ? (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
                <Lock className="w-5 h-5 text-slate-600 mx-auto" />
                <p className="text-slate-500">
                  Todavía no tienes una licencia de este EA. Cuando el equipo Mr.Steval te la
                  genere, va a aparecer aquí automáticamente.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span
                    className={
                      getConnectionStatus(realLicense.last_seen) === "Conectado"
                        ? "text-emerald-400"
                        : "text-slate-500"
                    }
                  >
                    {getConnectionStatus(realLicense.last_seen)}
                  </span>
                  <span className="text-slate-600">· Cuenta MT: {realLicense.account_number || "Sin vincular"}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5" /> Riesgo por trade:
                    </span>
                    <span className={`font-bold ${ACCENT.amber.text}`}>
                      {realLicense.risk_percent ? `${Number(realLicense.risk_percent).toFixed(1)}%` : "Sin datos"}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{
                        width: realLicense.risk_percent
                          ? `${Math.min(Number(realLicense.risk_percent) * 10, 100)}%`
                          : "0%",
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Este dato lo reporta el EA automáticamente — no se puede editar desde aquí.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Licencia:
                  </span>
                  <span className="text-white font-bold">{PLAN_LABEL[realLicense.plan] || "Vitalicia"}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className={`font-bold flex items-center gap-1.5 ${realLicense.profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    <DollarSign className="w-3.5 h-3.5" />
                    {realLicense.profit >= 0 ? "+" : "-"}${Math.abs(Number(realLicense.profit || 0)).toFixed(2)}
                  </span>
                  <button
                    onClick={toggleRealBot}
                    disabled={toggling}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 disabled:opacity-50 ${
                      realLicense.status === "active"
                        ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 border border-emerald-500/30"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {toggling ? "..." : realLicense.status === "active" ? "Apagar" : "Encender"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Cards "Próximamente" */}
          {PLACEHOLDER_BOTS.map((bot) => (
            <div
              key={bot.name}
              className={`glass-panel rounded-3xl p-6 border ${ACCENT[bot.accent].border} space-y-4 opacity-60`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className={`w-4 h-4 ${ACCENT[bot.accent].text}`} />
                  <h3 className="font-bold text-white text-sm">{bot.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold text-[10px]">
                  PRÓXIMAMENTE
                </span>
              </div>
              <p className="text-slate-500">{bot.desc}</p>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5" /> Riesgo por trade:
                  </span>
                  <span className="text-slate-600 font-bold">—</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span className="text-slate-600 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Sin datos
                </span>
                <button
                  disabled
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-600 font-bold cursor-not-allowed"
                >
                  Próximamente
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Gold King Bot Miner V1.0 ya es 100% real (licencia, conexión, profit). El riesgo por
        trade se llenará solo apenas el EA empiece a reportarlo. Los otros 2 EAs son catálogo a
        futuro, todavía sin datos.
      </p>
    </div>
  );
}

export default Bots;
