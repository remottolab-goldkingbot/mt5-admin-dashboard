import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

// Límite de Max Drawdown sugerido por el plan (referencia visual, ajustable a futuro)
const PLAN_MAX_DD_LIMIT = -500;

function EquityChart({ trades, compact = false }) {
  const data = useMemo(() => {
    const chrono = [...trades].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    let running = 0;
    return chrono.map((t, i) => {
      running += Number(t.pnl);
      return { name: `#${i + 1}`, equity: running };
    });
  }, [trades]);

  const hasData = data.length > 0;
  const lastValue = hasData ? data[data.length - 1].equity : 0;
  const isPositive = lastValue >= 0;

  return (
    <div className={`glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 h-full ${compact ? "" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Curva de Equity</span>
        </h3>
        {hasData && (
          <span className={`text-sm font-black font-mono ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
            {isPositive ? "+" : "-"}${Math.abs(lastValue).toFixed(2)}
          </span>
        )}
      </div>

      {hasData ? (
        <div className={compact ? "h-40" : "h-64"}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} width={45} />
              <Tooltip
                contentStyle={{ background: "#0b0f17", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Equity"]}
              />
              <ReferenceLine
                y={PLAN_MAX_DD_LIMIT}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: "Límite Plan", position: "insideBottomRight", fill: "#f43f5e", fontSize: 9 }}
              />
              <ReferenceLine y={0} stroke="#334155" />
              <Line
                type="monotone"
                dataKey="equity"
                stroke={isPositive ? "#10b981" : "#f43f5e"}
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={`flex items-center justify-center text-slate-500 text-xs font-mono ${compact ? "h-40" : "h-64"}`}>
          Registra tu primer trade para ver tu curva de equity aquí.
        </div>
      )}

      <p className="text-[10px] text-slate-500 font-mono text-center">
        Línea roja punteada = límite de drawdown sugerido para tu plan de riesgo.
      </p>
    </div>
  );
}

export default EquityChart;
