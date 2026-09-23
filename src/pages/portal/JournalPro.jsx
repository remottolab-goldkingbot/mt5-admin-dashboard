import { useMemo, useState } from "react";
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

const ASSETS = ["XAUUSD (Oro)", "EURUSD", "SOLUSDT", "BTCUSDT", "US30 (Dow Jones)"];
const SESSIONS = ["Nueva York (NY)", "Londres (LDN)", "Asia / Tokio", "Overlap NY/LDN"];
const SETUPS = ["Gold Cascade Recovery", "Smart Money Sweep", "Solana Grid Master EA", "BOS Structural Break"];
const EMOTIONS = ["Calmado y Enfocado", "Ansioso / Ligera Duda", "FOMO / Entrada Tardía", "Venganza / Post Pérdida"];
const ERROR_TAGS = ["Sin Errores (Ejecución Limpia)", "Mover SL en contra", "Cierre Prematuro por Miedo", "Sobre-lotaje no autorizado"];

const INITIAL_TRADES = [
  { date: "15 Sep - 09:30", asset: "XAUUSD", session: "Nueva York", type: "LONG", lots: "1.50", entry: "2510.50 ➔ 2525.80", setup: "Gold Cascade", errorTag: "Limpio ✅", clean: true, pnl: 290 },
  { date: "14 Sep - 14:15", asset: "SOLUSDT", session: "Nueva York", type: "LONG", lots: "10.00", entry: "132.40 ➔ 138.10", setup: "Solana Grid EA", errorTag: "Limpio ✅", clean: true, pnl: 380 },
  { date: "11 Sep - 10:05", asset: "EURUSD", session: "Londres", type: "SHORT", lots: "2.00", entry: "1.1040 ➔ 1.0980", setup: "Smart Money Sweep", errorTag: "Limpio ✅", clean: true, pnl: 1150 },
  { date: "09 Sep - 16:20", asset: "XAUUSD", session: "Asia", type: "SHORT", lots: "1.00", entry: "2505.00 ➔ 2512.50", setup: "Gold Cascade", errorTag: "Mover SL ❌", clean: false, pnl: -250 },
];

// Genera una cuadrícula simple del mes actual (semana Domingo→Sábado) con resultados demo día por día
function useMonthGrid() {
  return useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Domingo=0 ... Sábado=6 (coincide directo con Date.getDay())
    const startOffset = firstDay.getDay();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = (startOffset + d - 1) % 7;
      const isWeekend = dow === 0 || dow === 6;
      let pnl = null;
      let trades = 0;
      if (!isWeekend) {
        const seed = (d * 17) % 10;
        trades = 1 + (seed % 4);
        pnl = seed < 3 ? -(50 + seed * 40) : 150 + seed * 60;
      }
      cells.push({ day: d, isWeekend, pnl, trades });
    }
    return cells;
  }, []);
}

function JournalPro() {
  const calendarCells = useMonthGrid();
  const monthLabel = new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" });

  const [trades, setTrades] = useState(INITIAL_TRADES);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.lots || !form.entry || form.pnl === "") return;

    const pnlValue = parseFloat(form.pnl);

    setTrades((prev) => [
      {
        date: "Hoy - Ahora",
        asset: form.asset,
        session: form.session.split(" (")[0],
        type: form.type,
        lots: form.lots,
        entry: `${form.entry} ➔ Ejecución`,
        setup: form.setup,
        errorTag: form.errorTag.includes("Limpio") || form.errorTag.includes("Sin Errores") ? "Limpio ✅" : form.errorTag,
        clean: form.errorTag.includes("Sin Errores"),
        pnl: pnlValue,
      },
      ...prev,
    ]);

    setForm((f) => ({ ...f, lots: "", entry: "", sl: "", tp: "", pnl: "", notes: "" }));
  };

  const filteredTrades = trades.filter((t) => {
    const text = `${t.asset} ${t.session} ${t.setup} ${t.errorTag}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesSession = !sessionFilter || t.session.toLowerCase().includes(sessionFilter.toLowerCase());
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
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase tracking-wider">
                {monthLabel}
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

      {/* KPI Cards (8 métricas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>PnL NETO MES</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">+$4,430.00 USD</div>
          <span className="text-[10px] text-slate-500">+12.8% Cuenta Real</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>WIN RATE</span>
            <PieChart className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">68.4%</div>
          <span className="text-[10px] text-cyan-400">26 Ganadas / 12 Perdidas</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>PROFIT FACTOR</span>
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">2.15</div>
          <span className="text-[10px] text-slate-500">Nivel Óptimo (&gt; 1.8)</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>RATIO R:R PROMEDIO</span>
            <Target className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-white">1 : 2.4</div>
          <span className="text-[10px] text-slate-500">Plan Meta: 1:2.0</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>MAX DRAWDOWN</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-black text-rose-400">-3.2%</div>
          <span className="text-[10px] text-slate-500">Límite Permitido: -5.0%</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>DISCIPLINA OPERATIVA</span>
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">94.7%</div>
          <span className="text-[10px] text-slate-500">Reglas Cumplidas</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-1">
          <div className="text-rose-400 text-[10px] uppercase flex items-center justify-between">
            <span>COSTO DE ERRORES ($)</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">-$430.00</div>
          <span className="text-[10px] text-slate-400">2 Trades fuera de Plan</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
          <div className="text-emerald-400 text-[10px] uppercase flex items-center justify-between">
            <span>MEJOR SESIÓN</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">Nueva York</div>
          <span className="text-[10px] text-emerald-400">+$3,240.00 (73% WR)</span>
        </div>
      </div>

      {/* Calendario Visual */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono">Calendario Visual de PnL Diario</h2>
              <p className="text-xs text-slate-400 font-mono capitalize">
                Resultados acumulados por jornada operativa ({monthLabel})
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center font-mono text-xs text-slate-400 font-bold">
          <div className="text-slate-600">DOM</div>
          <div>LUN</div>
          <div>MAR</div>
          <div>MIÉ</div>
          <div>JUE</div>
          <div>VIE</div>
          <div className="text-slate-600">SÁB</div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 font-mono text-xs">
          {calendarCells.map((cell, i) => {
            if (!cell) {
              return <div key={i} className="h-20 sm:h-24 rounded-2xl bg-slate-950/40 border border-slate-900/50" />;
            }
            if (cell.isWeekend) {
              return (
                <div key={i} className="h-20 sm:h-24 rounded-2xl bg-slate-950/30 border border-slate-900 p-2 sm:p-3 flex flex-col justify-between opacity-40">
                  <span className="text-slate-500 text-[10px]">{cell.day}</span>
                  <span className="text-[10px] text-slate-600">Weekend</span>
                </div>
              );
            }
            const positive = cell.pnl >= 0;
            return (
              <div
                key={i}
                className={`h-20 sm:h-24 rounded-2xl p-2 sm:p-3 flex flex-col justify-between transition-all cursor-pointer ${
                  positive
                    ? "bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400"
                    : "bg-rose-500/10 border border-rose-500/30 hover:border-rose-400"
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-white font-bold">{cell.day}</span>
                  <span className={`${positive ? "text-emerald-400" : "text-rose-400"} text-[9px]`}>
                    {cell.trades} Trades
                  </span>
                </div>
                <div className={`${positive ? "text-emerald-400" : "text-rose-400"} font-bold text-xs sm:text-sm`}>
                  {positive ? "+" : ""}${cell.pnl}
                </div>
              </div>
            );
          })}
        </div>
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
              <button type="submit" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg rose-glow transition-all flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Guardar en Bitácora PRO</span>
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
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">ÓPTIMO</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Estado emocional estable. Has cumplido tus descansos mínimos entre ejecuciones hoy.
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

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800/80">
                <th className="py-3 font-normal">FECHA / HORA</th>
                <th className="py-3 font-normal">ACTIVO</th>
                <th className="py-3 font-normal">SESIÓN</th>
                <th className="py-3 font-normal">TIPO</th>
                <th className="py-3 font-normal">LOTES</th>
                <th className="py-3 font-normal">ENTRADA ➔ SALIDA</th>
                <th className="py-3 font-normal">ESTRATEGIA</th>
                <th className="py-3 font-normal">ERROR TAG</th>
                <th className="py-3 font-normal text-center">GRÁFICO</th>
                <th className="py-3 font-normal text-right">PnL ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTrades.map((t, i) => (
                <tr key={i}>
                  <td className="py-3.5 text-slate-400">{t.date}</td>
                  <td className="py-3.5 text-white font-semibold">{t.asset}</td>
                  <td className="py-3.5 text-slate-300">{t.session}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] ${
                        t.type === "LONG"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300">{t.lots}</td>
                  <td className="py-3.5 text-slate-400">{t.entry}</td>
                  <td className="py-3.5 text-amber-400">{t.setup}</td>
                  <td className={`py-3.5 ${t.clean ? "text-emerald-400" : "text-rose-400"}`}>{t.errorTag}</td>
                  <td className="py-3.5 text-center">
                    <button
                      onClick={() => alert("Abriendo gráfico TradingView...")}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <Image className="w-4 h-4 inline" />
                    </button>
                  </td>
                  <td className={`py-3.5 text-right font-bold ${t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.pnl >= 0 ? "+" : "-"}${Math.abs(t.pnl).toFixed(2)}
                  </td>
                </tr>
              ))}

              {filteredTrades.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-slate-500">
                    Sin resultados para ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default JournalPro;
