import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  DollarSign,
  Activity,
  BookOpen,
  ShieldCheck,
  Clock,
  GraduationCap,
} from "lucide-react";
import EquityChart from "./EquityChart";

const REAL_EA_NAME = "Gold King Bot Miner V1.0";

function getConnectionStatus(lastSeen) {
  if (!lastSeen) return "Sin conexión";
  const diffMinutes = (new Date() - new Date(lastSeen)) / 1000 / 60;
  return diffMinutes < 5 ? "Conectado" : "Sin conexión";
}

function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = (user?.name || "Alumno").split(" ")[0];

  const [licenses, setLicenses] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const [licRes, tradeRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/licenses/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/journal/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const licData = await licRes.json();
        const tradeData = await tradeRes.json();

        if (licRes.ok) setLicenses(licData);
        if (tradeRes.ok) setTrades(tradeData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const realLicense = licenses.find((l) => l.ea_name === REAL_EA_NAME);
  const activeLicenses = licenses.filter((l) => l.status === "active").length;
  const profitTotal = licenses.reduce((acc, l) => acc + Number(l.profit || 0), 0);

  // Ganancia real del día (solo trades del Journal de hoy)
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayTrades = trades.filter((t) => new Date(t.created_at).toDateString() === today);
    const pnl = todayTrades.reduce((acc, t) => acc + Number(t.pnl), 0);
    return { pnl, count: todayTrades.length };
  }, [trades]);

  const last3Trades = [...trades]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    <div className="space-y-6 font-sans">
      <div className="glass-panel-gold rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
            SISTEMA AUDITADO
          </span>
          <h1 className="text-2xl font-black text-white">
            ¡Bienvenido de nuevo, <span className="text-gradient-gold">{firstName}</span>!
          </h1>
          <p className="text-slate-400 text-xs">
            Ganancia de hoy en tu Journal:{" "}
            <strong className={`font-mono ${todayStats.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {todayStats.pnl >= 0 ? "+" : "-"}${Math.abs(todayStats.pnl).toFixed(2)}
            </strong>{" "}
            ({todayStats.count} trade{todayStats.count !== 1 ? "s" : ""} hoy)
          </p>
        </div>

        <button
          onClick={() => navigate("/portal/journal")}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Trade</span>
        </button>
      </div>

      {error && <p className="text-rose-400 text-xs font-mono">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">EQUITY DE TU EA</span>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {realLicense?.equity ? `$${Number(realLicense.equity).toFixed(2)}` : "—"}
          </div>
          <span className={`text-[10px] font-mono block mt-1 ${profitTotal >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            Profit Total: {profitTotal >= 0 ? "+" : "-"}${Math.abs(profitTotal).toFixed(2)}
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">RESULTADO DIARIO (JOURNAL)</span>
          <div className={`text-2xl font-black font-mono mt-1 ${todayStats.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {todayStats.pnl >= 0 ? "+" : "-"}${Math.abs(todayStats.pnl).toFixed(2)}
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">
            {todayStats.count} trade{todayStats.count !== 1 ? "s" : ""} hoy
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">LICENCIAS ACTIVAS</span>
          <div className="text-2xl font-black font-mono text-white mt-1">{activeLicenses}</div>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            de {licenses.length} totales
          </span>
        </div>

        <Link
          to="/portal/academia"
          className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/40 transition-all block"
        >
          <span className="text-[10px] font-mono text-slate-400 block">PROGRESO ACADEMIA</span>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">68%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full" style={{ width: "68%" }} />
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <EquityChart trades={trades} />
        </div>

        <div className="lg:col-span-4 space-y-4">
          {/* Estado real del EA */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3 font-mono text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Estado de tu EA</span>
            </h3>
            {realLicense ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">{REAL_EA_NAME}</span>
                  <span className={realLicense.status === "active" ? "text-emerald-400" : "text-rose-400"}>
                    {realLicense.status === "active" ? "Activo" : "Apagado"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Conexión
                  </span>
                  <span className={getConnectionStatus(realLicense.last_seen) === "Conectado" ? "text-emerald-400" : "text-slate-500"}>
                    {getConnectionStatus(realLicense.last_seen)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cuenta MT</span>
                  <span className="text-white">{realLicense.account_number || "Sin vincular"}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Aún no tienes un EA asignado.</p>
            )}
          </div>

          {/* Ultimas operaciones reales del Journal */}
          <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3 font-mono text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Tus Últimas Operaciones</span>
            </h3>
            {last3Trades.length === 0 ? (
              <p className="text-slate-500">Sin trades registrados todavía.</p>
            ) : (
              <div className="space-y-2">
                {last3Trades.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                    <div>
                      <span className={`font-bold ${t.type === "BUY" || t.type === "LONG" ? "text-emerald-400" : "text-rose-400"}`}>
                        {t.type} {t.asset}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(t.created_at).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                    <span className={`font-bold ${Number(t.pnl) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {Number(t.pnl) >= 0 ? "+" : "-"}${Math.abs(Number(t.pnl)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
