import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  FileUp,
  PlusCircle,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  ShieldAlert,
  Brain,
  AlertTriangle,
  Clock,
  Calendar,
  Edit3,
  Zap,
  Save,
  Calculator,
  Image,
  List,
  Download,
  Sparkles,
  Lock,
} from "lucide-react";
import EquityChart from "./EquityChart";

const ASSETS = ["XAUUSD (Oro)", "EURUSD", "SOLUSDT", "BTCUSDT", "US30 (Dow Jones)"];
const SESSIONS = ["Nueva York (NY)", "Londres (LDN)", "Asia / Tokio", "Overlap NY/LDN"];
const SETUPS = ["Gold Cascade Recovery", "Smart Money Sweep", "Solana Grid Master EA", "BOS Structural Break"];
const EMOTIONS = ["Calmado y Enfocado", "Ansioso / Ligera Duda", "FOMO / Entrada Tardía", "Venganza / Post Pérdida"];
const ERROR_TAGS = ["Sin Errores (Ejecución Limpia)", "Mover SL en contra", "Cierre Prematuro por Miedo", "Sobre-lotaje no autorizado"];

const MONTH_LABEL = new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" });

function JournalPro() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("manual");
  const [search, setSearch] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");

  const [form, setForm] = useState({
    asset: ASSETS[0],
    session: SESSIONS[0],
    type: "LONG",
    lots: "",
    entry: "",
    sl: "",
    tp: "",
    pnl: "",
    setup: SETUPS[0],
    emotion: EMOTIONS[0],
    errorTag: ERROR_TAGS[0],
    chartUrl: "",
    notes: "",
  });

  const [calc, setCalc] = useState({ balance: 10000, risk: 1.0, pips: 25 });
  const lotResult = ((calc.balance * (calc.risk / 100)) / (calc.pips * 10)).toFixed(2);

  const token = localStorage.getItem("token");

  const fetchTrades = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/journal/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo cargar tu journal");
      setTrades(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // ==========================
  // Estadísticas reales derivadas de tus trades (empieza todo en 0 / "—" sin datos)
  // ==========================
  const stats = useMemo(() => {
    const total = trades.length;
    if (total === 0) {
      return {
        pnlNeto: 0,
        winRate: "0.0",
        wins: 0,
        losses: 0,
        profitFactor: "—",
        avgRR: "—",
        maxDrawdown: 0,
        disciplina: "—",
        costoErrores: 0,
        errorCount: 0,
        mejorSesion: "—",
        mejorSesionPnl: 0,
      };
    }

    const wins = trades.filter((t) => Number(t.pnl) >= 0);
    const losses = trades.filter((t) => Number(t.pnl) < 0);
    const pnlNeto = trades.reduce((acc, t) => acc + Number(t.pnl), 0);
    const winRate = ((wins.length / total) * 100).toFixed(1);

    const sumWins = wins.reduce((acc, t) => acc + Number(t.pnl), 0);
    const sumLosses = Math.abs(losses.reduce((acc, t) => acc + Number(t.pnl), 0));
    const profitFactor = sumLosses > 0 ? (sumWins / sumLosses).toFixed(2) : sumWins > 0 ? "∞" : "—";

    const avgWin = wins.length > 0 ? sumWins / wins.length : 0;
    const avgLoss = losses.length > 0 ? sumLosses / losses.length : 0;
    const avgRR = avgLoss > 0 ? `1 : ${(avgWin / avgLoss).toFixed(1)}` : "—";

    // Drawdown simple: punto mas bajo de la curva acumulada (ordenada del mas viejo al mas nuevo)
    const chrono = [...trades].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    let running = 0;
    let peak = 0;
    let maxDD = 0;
    chrono.forEach((t) => {
      running += Number(t.pnl);
      if (running > peak) peak = running;
      const dd = running - peak;
      if (dd < maxDD) maxDD = dd;
    });

    const cleanCount = trades.filter(
      (t) => !t.error_tag || t.error_tag.includes("Limpio") || t.error_tag.includes("Sin Errores")
    ).length;
    const disciplina = ((cleanCount / total) * 100).toFixed(1);

    const errorTrades = trades.filter(
      (t) => t.error_tag && !t.error_tag.includes("Limpio") && !t.error_tag.includes("Sin Errores")
    );
    const costoErrores = errorTrades.reduce((acc, t) => acc + Number(t.pnl), 0);

    const sessionTotals = {};
    trades.forEach((t) => {
      if (!t.session) return;
      sessionTotals[t.session] = (sessionTotals[t.session] || 0) + Number(t.pnl);
    });
    let mejorSesion = "—";
    let mejorSesionPnl = 0;
    Object.entries(sessionTotals).forEach(([s, v]) => {
      if (v > mejorSesionPnl || mejorSesion === "—") {
        mejorSesion = s;
        mejorSesionPnl = v;
      }
    });

    return {
      pnlNeto,
      winRate,
      wins: wins.length,
      losses: losses.length,
      profitFactor,
      avgRR,
      maxDrawdown: maxDD,
      disciplina,
      costoErrores,
      errorCount: errorTrades.length,
      mejorSesion,
      mejorSesionPnl,
    };
  }, [trades]);

  // ==========================
  // Calendario real: agrupa tus trades por dia del mes actual (Domingo -> Sabado)
  // ==========================
  const calendarCells = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDay.getDay(); // Domingo=0

    const byDay = {};
    trades.forEach((t) => {
      const d = new Date(t.created_at);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!byDay[day]) byDay[day] = { pnl: 0, count: 0 };
        byDay[day].pnl += Number(t.pnl);
        byDay[day].count += 1;
      }
    });

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = (startOffset + d - 1) % 7;
      const isWeekend = dow === 0 || dow === 6;
      const dayData = byDay[d];
      cells.push({
        day: d,
        isWeekend,
        hasData: Boolean(dayData),
        pnl: dayData ? dayData.pnl : 0,
        trades: dayData ? dayData.count : 0,
      });
    }
    return cells;
  }, [trades]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.lots || !form.entry || form.pnl === "") return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset: form.asset,
          type: form.type,
          entry_price: form.entry,
          sl: form.sl || null,
          tp: form.tp || null,
          lots: form.lots,
          pnl: parseFloat(form.pnl),
          session: form.session.split(" (")[0],
          setup: form.setup,
          emotion: form.emotion,
          error_tag: form.errorTag,
          chart_url: form.chartUrl || null,
          notes: form.notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo guardar el trade");

      setTrades((prev) => [data.trade, ...prev]);
      setForm((f) => ({ ...f, lots: "", entry: "", sl: "", tp: "", pnl: "", notes: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredTrades = trades.filter((t) => {
    const text = `${t.asset} ${t.session || ""} ${t.setup || ""} ${t.error_tag || ""}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesSession = !sessionFilter || (t.session || "").toLowerCase().includes(sessionFilter.toLowerCase());
    return matchesSearch && matchesSession;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 glass-panel-rose rounded-3xl border border-rose-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Trading Journal Ultra-PRO Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase tracking-wider capitalize">
                {MONTH_LABEL}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Análisis por Sesiones, Control de Fugas de Capital, Psicología Avanzada y Métricas MQL5
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono">
          <button
            onClick={() => alert("Importador MQL5: arrastra tu archivo .HTML o .CSV de MetaTrader para procesar automáticamente todos los trades.")}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 font-bold text-xs transition-all flex items-center gap-2"
          >
            <FileUp className="w-4 h-4 text-amber-400" />
            <span>Importar MT4/MT5</span>
          </button>
          <button
            onClick={() => document.getElementById("tradeFormSection")?.scrollIntoView({ behavior: "smooth" })}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg rose-glow transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Nuevo Trade</span>
          </button>
        </div>
      </div>

      {error && <p className="text-rose-400 text-xs font-mono">{error}</p>}

      {trades.length === 0 && !loading && (
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center text-slate-400 text-xs font-mono">
          Todavía no has registrado ningún trade en tu cuenta PRO — las métricas de abajo van a
          llenarse solas apenas registres el primero.
        </div>
      )}

      {/* KPI Cards (8 métricas, 100% reales) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>PnL NETO {MONTH_LABEL.split(" ")[0].toUpperCase()}</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className={`text-xl font-black ${stats.pnlNeto >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {stats.pnlNeto >= 0 ? "+" : "-"}${Math.abs(stats.pnlNeto).toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">{trades.length} operaciones totales</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>WIN RATE</span>
            <PieChart className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">{stats.winRate}%</div>
          <span className="text-[10px] text-cyan-400">{stats.wins} Ganadas / {stats.losses} Perdidas</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>PROFIT FACTOR</span>
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{stats.profitFactor}</div>
          <span className="text-[10px] text-slate-500">Ganancia / Pérdida</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>RATIO GANANCIA:PÉRDIDA</span>
            <Target className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-white">{stats.avgRR}</div>
          <span className="text-[10px] text-slate-500">Promedio real</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>MAX DRAWDOWN</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-black text-rose-400">${stats.maxDrawdown.toFixed(2)}</div>
          <span className="text-[10px] text-slate-500">Caída máx. desde pico</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>DISCIPLINA OPERATIVA</span>
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{stats.disciplina === "—" ? "—" : `${stats.disciplina}%`}</div>
          <span className="text-[10px] text-slate-500">Trades sin error tag</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-1">
          <div className="text-rose-400 text-[10px] uppercase flex items-center justify-between">
            <span>COSTO DE ERRORES ($)</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">
            {stats.costoErrores === 0 ? "$0.00" : `-$${Math.abs(stats.costoErrores).toFixed(2)}`}
          </div>
          <span className="text-[10px] text-slate-400">{stats.errorCount} trades fuera de plan</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
          <div className="text-emerald-400 text-[10px] uppercase flex items-center justify-between">
            <span>MEJOR SESIÓN</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{stats.mejorSesion}</div>
          <span className="text-[10px] text-emerald-400">
            {stats.mejorSesion !== "—" ? `+$${stats.mejorSesionPnl.toFixed(2)}` : "Sin datos"}
          </span>
        </div>
      </div>

      {/* Calendario Visual + Curva de Equity (2 columnas) */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">Calendario de PnL</h2>
                <p className="text-xs text-slate-400 font-mono capitalize">{MONTH_LABEL}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center font-mono text-[10px] text-slate-400 font-bold">
            <div className="text-slate-600">DOM</div>
            <div>LUN</div>
            <div>MAR</div>
            <div>MIÉ</div>
            <div>JUE</div>
            <div>VIE</div>
            <div className="text-slate-600">SÁB</div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 font-mono text-[10px]">
            {calendarCells.map((cell, i) => {
              if (!cell) {
                return <div key={i} className="h-14 sm:h-16 rounded-xl bg-slate-950/40 border border-slate-900/50" />;
              }
              if (!cell.hasData) {
                return (
                  <div
                    key={i}
                    className={`h-14 sm:h-16 rounded-xl border p-1.5 flex flex-col justify-between ${
                      cell.isWeekend
                        ? "bg-slate-950/30 border-slate-900 opacity-40"
                        : "bg-slate-950/40 border-slate-900/60"
                    }`}
                  >
                    <span className="text-slate-500">{cell.day}</span>
                  </div>
                );
              }
              const positive = cell.pnl >= 0;
              return (
                <div
                  key={i}
                  className={`h-14 sm:h-16 rounded-xl p-1.5 flex flex-col justify-between transition-all cursor-pointer ${
                    positive
                      ? "bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400"
                      : "bg-rose-500/10 border border-rose-500/30 hover:border-rose-400"
                  }`}
                >
                  <span className="text-white font-bold">{cell.day}</span>
                  <span className={`${positive ? "text-emerald-400" : "text-rose-400"} font-bold`}>
                    {positive ? "+" : "-"}${Math.abs(cell.pnl).toFixed(0)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <EquityChart trades={trades} />
      </div>

      {/* Formulario avanzado + calculadora */}
      <div id="tradeFormSection" className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Registro Ultra-PRO (Auditoría Avanzada)</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> MQL5 Sync Ready
            </span>
          </div>

          {/* Selector Manual / Automático */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono w-fit">
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                mode === "manual" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Registro Manual</span>
            </button>
            <button
              type="button"
              disabled
              title="Próximamente: conecta tu cuenta MT4/MT5 y se registra solo"
              className="px-3.5 py-1.5 rounded-lg font-bold text-slate-600 flex items-center gap-1.5 cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automático (Próximamente)</span>
              <Lock className="w-3 h-3" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-400 mb-1.5">ACTIVO / PAR</label>
                <select value={form.asset} onChange={(e) => setForm((f) => ({ ...f, asset: e.target.value }))} className="w-full glass-input p-3 rounded-xl text-white">
                  {ASSETS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">SESIÓN OPERATIVA</label>
                <select value={form.session} onChange={(e) => setForm((f) => ({ ...f, session: e.target.value }))} className="w-full glass-input p-3 rounded-xl text-white">
                  {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">DIRECCIÓN</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full glass-input p-3 rounded-xl text-white">
                  <option value="LONG">BUY / LONG 🟢</option>
                  <option value="SHORT">SELL / SHORT 🔴</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">LOTAJE / POSICIÓN</label>
                <input type="number" step="0.01" value={form.lots} onChange={(e) => setForm((f) => ({ ...f, lots: e.target.value }))} placeholder="1.50" required className="w-full glass-input p-3 rounded-xl text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-400 mb-1.5">PRECIO ENTRADA</label>
                <input type="number" step="0.0001" value={form.entry} onChange={(e) => setForm((f) => ({ ...f, entry: e.target.value }))} placeholder="2510.50" required className="w-full glass-input p-3 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">STOP LOSS</label>
                <input type="number" step="0.0001" value={form.sl} onChange={(e) => setForm((f) => ({ ...f, sl: e.target.value }))} placeholder="2502.00" className="w-full glass-input p-3 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">TAKE PROFIT</label>
                <input type="number" step="0.0001" value={form.tp} onChange={(e) => setForm((f) => ({ ...f, tp: e.target.value }))} placeholder="2530.00" className="w-full glass-input p-3 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">RESULTADO ($ USD)</label>
                <input type="number" step="0.01" value={form.pnl} onChange={(e) => setForm((f) => ({ ...f, pnl: e.target.value }))} placeholder="+290.00" required className="w-full glass-input p-3 rounded-xl text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 mb-1.5">ESTRATEGIA / SETUP</label>
                <select value={form.setup} onChange={(e) => setForm((f) => ({ ...f, setup: e.target.value }))} className="w-full glass-input p-3 rounded-xl text-white">
                  {SETUPS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">ESTADO EMOCIONAL</label>
                <select value={form.emotion} onChange={(e) => setForm((f) => ({ ...f, emotion: e.target.value }))} className="w-full glass-input p-3 rounded-xl text-white">
                  {EMOTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">TAG DE ERROR / FUGA</label>
                <select value={form.errorTag} onChange={(e) => setForm((f) => ({ ...f, errorTag: e.target.value }))} className="w-full glass-input p-3 rounded-xl text-white">
                  {ERROR_TAGS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1.5">URL CAPTURA GRÁFICO (TRADINGVIEW)</label>
                <input type="url" value={form.chartUrl} onChange={(e) => setForm((f) => ({ ...f, chartUrl: e.target.value }))} placeholder="https://www.tradingview.com/x/..." className="w-full glass-input p-3 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">OBSERVACIONES TÉCNICAS</label>
                <input type="text" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Ej: Confirmación en Order Block 15m." className="w-full glass-input p-3 rounded-xl text-white" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg rose-glow transition-all flex items-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" />
                <span>{saving ? "Guardando..." : "Guardar en Bitácora PRO"}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>Calculadora de Lotaje Instantánea</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">BALANCE CUENTA ($)</label>
                <input
                  type="number"
                  value={calc.balance}
                  onChange={(e) => setCalc((c) => ({ ...c, balance: parseFloat(e.target.value) || 0 }))}
                  className="w-full glass-input p-2.5 rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">% RIESGO</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calc.risk}
                    onChange={(e) => setCalc((c) => ({ ...c, risk: parseFloat(e.target.value) || 0 }))}
                    className="w-full glass-input p-2.5 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">STOP LOSS (PIPS)</label>
                  <input
                    type="number"
                    value={calc.pips}
                    onChange={(e) => setCalc((c) => ({ ...c, pips: parseFloat(e.target.value) || 1 }))}
                    className="w-full glass-input p-2.5 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                <span className="text-slate-400 text-[10px] block">LOTAJE RECOMENDADO</span>
                <span className="text-lg font-black text-cyan-400">{lotResult} Lotes</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Detector de Tilt & Venganza
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                {stats.errorCount === 0 ? "ÓPTIMO" : `${stats.errorCount} ALERTAS`}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {stats.errorCount === 0
                ? "Sin trades marcados con error todavía. Cuando registres uno con un tag de fuga, aquí se avisa."
                : `Tienes ${stats.errorCount} trade(s) marcados con error/fuga. Revisa tu tag de error en la tabla de abajo.`}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla filtrable */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <List className="w-4 h-4 text-cyan-400" />
              <span>Historial Auditado de Operaciones</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Listado completo con filtros de sesión, error tag y gráfico
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="glass-input text-xs py-2 px-3 rounded-xl font-mono text-white"
            >
              <option value="">Todas las Sesiones</option>
              <option value="Nueva York">Nueva York</option>
              <option value="Londres">Londres</option>
              <option value="Asia">Asia</option>
            </select>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar par o setup..."
              className="glass-input py-2 px-3 text-xs rounded-xl font-mono text-white w-full sm:w-48"
            />

            <button
              onClick={() => alert("Exportando reporte completo a PDF / CSV...")}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 text-emerald-400 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500 text-xs font-mono">Cargando tu journal...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800/80">
                  <th className="py-3 font-normal">FECHA / HORA</th>
                  <th className="py-3 font-normal">ACTIVO</th>
                  <th className="py-3 font-normal">SESIÓN</th>
                  <th className="py-3 font-normal">TIPO</th>
                  <th className="py-3 font-normal">LOTES</th>
                  <th className="py-3 font-normal">ENTRADA</th>
                  <th className="py-3 font-normal">ESTRATEGIA</th>
                  <th className="py-3 font-normal">ERROR TAG</th>
                  <th className="py-3 font-normal text-center">GRÁFICO</th>
                  <th className="py-3 font-normal text-right">PnL ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredTrades.map((t) => {
                  const isClean = !t.error_tag || t.error_tag.includes("Limpio") || t.error_tag.includes("Sin Errores");
                  return (
                    <tr key={t.id}>
                      <td className="py-3.5 text-slate-400">
                        {new Date(t.created_at).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3.5 text-white font-semibold">{t.asset}</td>
                      <td className="py-3.5 text-slate-300">{t.session || "—"}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] ${
                            t.type === "LONG" || t.type === "BUY"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-300">{t.lots || "—"}</td>
                      <td className="py-3.5 text-slate-400">{t.entry_price}</td>
                      <td className="py-3.5 text-amber-400">{t.setup || "—"}</td>
                      <td className={`py-3.5 ${isClean ? "text-emerald-400" : "text-rose-400"}`}>
                        {t.error_tag || "—"}
                      </td>
                      <td className="py-3.5 text-center">
                        {t.chart_url ? (
                          <a href={t.chart_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                            <Image className="w-4 h-4 inline" />
                          </a>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className={`py-3.5 text-right font-bold ${Number(t.pnl) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {Number(t.pnl) >= 0 ? "+" : "-"}${Math.abs(Number(t.pnl)).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}

                {filteredTrades.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-slate-500">
                      {trades.length === 0
                        ? "Todavía no has registrado ningún trade. ¡Registra el primero arriba!"
                        : "Sin resultados para ese filtro."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalPro;
