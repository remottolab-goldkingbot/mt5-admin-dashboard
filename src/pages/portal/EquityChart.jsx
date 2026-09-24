import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

// Valores de referencia del plan (ejemplo/editable — no vienen de datos reales de tu cuenta todavía)
const SALDO_INICIAL = 0;
const OBJETIVO_BENEFICIO = 1000;
const REDUCCION_DIARIA = -200;
const REDUCCION_MAXIMA = -500;

const LEGEND = [
  { label: "Saldo", color: "#22c55e", dash: false },
  { label: "Saldo Inicial", color: "#22d3ee", dash: true },
  { label: "Objetivo de Beneficio", color: "#eab308", dash: true },
  { label: "Reducción Diaria", color: "#f59e0b", dash: true },
  { label: "Reducción Máxima", color: "#ef4444", dash: true },
];

function EquityChart({ trades, compact = false }) {
  const data = useMemo(() => {
    const chrono = [...trades].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    let running = 0;
    const points = [{ name: "Inicio", saldo: 0 }];
    chrono.forEach((t, i) => {
      running += Number(t.pnl);
      points.push({ name: `#${i + 1}`, saldo: running });
    });
    return points;
  }, [trades]);

  const hasData = trades.length > 0;
  const lastValue = hasData ? data[data.length - 1].saldo : 0;
  const isPositive = lastValue >= 0;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Curva de Saldo</span>
        </h3>
        {hasData && (
          <span className={`text-sm font-black font-mono ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
            {isPositive ? "+" : "-"}${Math.abs(lastValue).toFixed(2)}
          </span>
        )}
      </div>

      {hasData ? (
        <div className={compact ? "h-48" : "h-72"}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="saldoFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} width={45} />
              <Tooltip
                contentStyle={{ background: "#0b0f17", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Saldo"]}
              />

              <ReferenceLine y={SALDO_INICIAL} stroke="#22d3ee" strokeDasharray="4 4" label={{ value: "Saldo Inicial", position: "insideTopLeft", fill: "#22d3ee", fontSize: 9 }} />
              <ReferenceLine y={OBJETIVO_BENEFICIO} stroke="#eab308" strokeDasharray="4 4" label={{ value: "Objetivo", position: "insideTopLeft", fill: "#eab308", fontSize: 9 }} />
              <ReferenceLine y={REDUCCION_DIARIA} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Reducc. Diaria", position: "insideBottomLeft", fill: "#f59e0b", fontSize: 9 }} />
              <ReferenceLine y={REDUCCION_MAXIMA} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Reducc. Máxima", position: "insideBottomLeft", fill: "#ef4444", fontSize: 9 }} />

              <Area type="monotone" dataKey="saldo" stroke="none" fill="url(#saldoFill)" />
              <Line type="monotone" dataKey="saldo" stroke="#22c55e" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={`flex items-center justify-center text-slate-500 text-xs font-mono ${compact ? "h-48" : "h-72"}`}>
          Registra tu primer trade para ver tu curva de saldo aquí.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 justify-center pt-1 border-t border-slate-800/60">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.color, opacity: item.dash ? 0.6 : 1 }}
            />
            {item.label}
          </span>
        ))}
      </div>

      <p className="text-[9px] text-slate-600 font-mono text-center">
        * Objetivo/Reducción diaria/máxima son valores de ejemplo — se pueden personalizar por
        cuenta más adelante.
      </p>
    </div>
  );
}

export default EquityChart;
