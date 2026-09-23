import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Plus,
  DollarSign,
  PieChart,
  Activity,
  Lock,
  Calendar,
  Edit,
  Save,
  CheckSquare,
  List,
} from "lucide-react";

const INITIAL_TRADES = [
  { date: "15 Sep - 09:30", asset: "XAUUSD", type: "BUY", entry: "2510.50", notes: "Reacción en soporte H1", pnl: 200 },
  { date: "14 Sep - 14:15", asset: "EURUSD", type: "SELL", entry: "1.0950", notes: "Ruptura fallida de sesión", pnl: -120 },
  { date: "11 Sep - 10:05", asset: "BTCUSDT", type: "BUY", entry: "57400.00", notes: "Scalp de continuación", pnl: 400 },
];

function JournalFree() {
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [totals, setTotals] = useState({ pnl: 480, wins: 2, total: 3 });
  const [form, setForm] = useState({ asset: "", type: "BUY", entry: "", pnl: "", notes: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.asset || !form.entry || form.pnl === "") return;

    const pnlValue = parseFloat(form.pnl);
    const isWin = pnlValue >= 0;

    setTrades((prev) => [
      {
        date: "Hoy - Ahora",
        asset: form.asset.toUpperCase(),
        type: form.type,
        entry: form.entry,
        notes: form.notes || "Sin notas",
        pnl: pnlValue,
      },
      ...prev,
    ]);

    setTotals((prev) => {
      const total = prev.total + 1;
      const wins = prev.wins + (isWin ? 1 : 0);
      return { pnl: prev.pnl + pnlValue, wins, total };
    });

    setForm({ asset: "", type: "BUY", entry: "", pnl: "", notes: "" });
  };

  const winRate = ((totals.wins / totals.total) * 100).toFixed(1);

  return (
    <div className="space-y-8 font-sans">
      {/* Upsell banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 rounded-2xl py-2.5 px-4 text-center font-mono text-xs text-amber-300 flex flex-wrap items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>
          Estás utilizando el <strong>Plan Gratuito</strong>. Desbloquea el Calendario Visual,
          Psicología Avanzada y Análisis por Sesión en <strong>PRO</strong>.
        </span>
        <Link to="/#section-pricing" className="underline font-bold hover:text-white ml-1">
          Conocer Versión PRO →
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Bitácora de Trading Estándar</h1>
            <p className="text-xs text-slate-400 font-mono">
              Control operativo básico y registro diario de ejecuciones
            </p>
          </div>
        </div>

        <button
          onClick={() => document.getElementById("freeTradeForm")?.scrollIntoView({ behavior: "smooth" })}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-2 font-mono"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Trade</span>
        </button>
      </div>

      {/* KPI Cards: 3 activas + 3 con candado PRO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 font-mono">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>PnL NETO MES</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">
            {totals.pnl >= 0 ? "+" : "-"}${Math.abs(totals.pnl).toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Acumulado</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>WIN RATE</span>
            <PieChart className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">{winRate}%</div>
          <span className="text-[10px] text-cyan-400">
            {totals.wins} W / {totals.total - totals.wins} L
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 text-[10px] uppercase flex items-center justify-between">
            <span>TOTAL TRADES</span>
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white">{totals.total}</div>
          <span className="text-[10px] text-slate-500">Registrados</span>
        </div>

        {[
          { label: "PROFIT FACTOR", value: "2.15" },
          { label: "MAX DRAWDOWN", value: "-3.2%" },
          { label: "COSTO DE ERRORES", value: "-$450" },
        ].map((m) => (
          <div
            key={m.label}
            className="glass-panel p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-1"
          >
            <div className="text-slate-500 text-[10px] uppercase flex items-center justify-between">
              <span>{m.label}</span>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-slate-600 blur-[3px]">{m.value}</div>
            <Link to="/#section-pricing" className="text-[10px] text-amber-400/80 font-bold hover:underline block">
              🔒 Requiere PRO
            </Link>
          </div>
        ))}
      </div>

      {/* Calendario bloqueado */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 relative overflow-hidden text-center space-y-4 grid-bg">
        <div className="max-w-xl mx-auto space-y-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-mono">Calendario Visual de PnL Diario</h3>
          <p className="text-xs text-slate-400 font-mono">
            Visualiza tus días verdes y rojos en una cuadrícula mensual interactiva, analiza tu
            mejor día de trading y desglosa métricas por jornada operativa.
          </p>
          <div className="pt-2">
            <Link
              to="/#section-pricing"
              className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg gold-glow font-mono transition-all"
            >
              Desbloquear Calendario en Plan PRO →
            </Link>
          </div>
        </div>
      </div>

      {/* Form + Checklist */}
      <div id="freeTradeForm" className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Edit className="w-4 h-4 text-blue-400" />
              <span>Registro Básico de Operación</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Free Version</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 mb-1.5">ACTIVO / PAR</label>
                <input
                  type="text"
                  value={form.asset}
                  onChange={(e) => setForm((f) => ({ ...f, asset: e.target.value }))}
                  placeholder="Ej: XAUUSD, EURUSD"
                  required
                  className="w-full glass-input p-3 rounded-xl text-white uppercase"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">DIRECCIÓN</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full glass-input p-3 rounded-xl text-white"
                >
                  <option value="BUY">BUY 🟢</option>
                  <option value="SELL">SELL 🔴</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">PRECIO ENTRADA</label>
                <input
                  type="number"
                  step="0.0001"
                  value={form.entry}
                  onChange={(e) => setForm((f) => ({ ...f, entry: e.target.value }))}
                  placeholder="2510.50"
                  required
                  className="w-full glass-input p-3 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1.5">RESULTADO ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.pnl}
                  onChange={(e) => setForm((f) => ({ ...f, pnl: e.target.value }))}
                  placeholder="Ej: 150 o -50"
                  required
                  className="w-full glass-input p-3 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5">NOTAS BÁSICAS</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Resumen del trade..."
                  className="w-full glass-input p-3 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>
                  ¿Deseas registrar <strong>Sesiones (NY/LDN), Estado Emocional, Capturas de
                  Gráficos y Lotaje SL/TP</strong>?
                </span>
              </span>
              <Link to="/#section-pricing" className="font-bold underline text-amber-400 hover:text-white">
                Ver PRO
              </Link>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar en Bitácora</span>
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Reglas Esenciales</span>
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-900 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded bg-slate-900 border-slate-700 text-blue-500" />
              <span className="text-white font-semibold block">Usar Stop Loss predefinido</span>
            </label>
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-900 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded bg-slate-900 border-slate-700 text-blue-500" />
              <span className="text-white font-semibold block">Respetar el máximo de 3 trades</span>
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
            <span className="text-xs text-slate-400 font-mono block">
              ¿Necesitas un Detector de Revenge Trading y Calculadora de Riesgo?
            </span>
            <Link
              to="/#section-pricing"
              className="block w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 font-mono transition-all"
            >
              Ver Módulo de Psicología PRO
            </Link>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <List className="w-4 h-4 text-cyan-400" />
              <span>Historial Reciente de Operaciones</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Plan Free: Muestra últimos registros del mes activo
            </p>
          </div>

          <Link
            to="/#section-pricing"
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Historial Completo & Exportación</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800/80">
                <th className="py-3 font-normal">FECHA</th>
                <th className="py-3 font-normal">ACTIVO</th>
                <th className="py-3 font-normal">TIPO</th>
                <th className="py-3 font-normal">ENTRADA</th>
                <th className="py-3 font-normal">NOTAS</th>
                <th className="py-3 font-normal text-right">PnL ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {trades.map((t, i) => (
                <tr key={i}>
                  <td className="py-3.5 text-slate-400">{t.date}</td>
                  <td className="py-3.5 text-white font-semibold">{t.asset}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        t.type === "BUY"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300">{t.entry}</td>
                  <td className="py-3.5 text-slate-400">{t.notes}</td>
                  <td
                    className={`py-3.5 text-right font-bold ${
                      t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {t.pnl >= 0 ? "+" : "-"}${Math.abs(t.pnl).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2 font-mono">
          <span className="text-xs text-slate-400">
            🔒 Registros limitados. La versión PRO sincroniza automáticamente con MetaTrader 4 / 5
            y guarda historial ilimitado en la nube.
          </span>
          <div>
            <Link to="/#section-pricing" className="text-xs text-amber-400 font-bold underline hover:text-amber-300">
              Obtener Plan PRO Institucional
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalFree;
