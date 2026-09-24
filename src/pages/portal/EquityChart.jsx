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

/**
 * settings (opcional — si no se pasa, el gráfico queda simple: solo Saldo + Saldo Inicial).
 * {
 *   account_type: "fondeo" | "real",
 *   initial_balance: number,
 *   profit_target: number | null,
 *   daily_limit: number | null,
 *   max_limit: number | null,
 *   has_personal_goals: boolean
 * }
 */
function EquityChart({ trades, compact = false, settings = null }) {
  const initialBalance = Number(settings?.initial_balance || 0);

  const data = useMemo(() => {
    const chrono = [...trades].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    let running = initialBalance;
    const points = [{ name: "Inicio", saldo: initialBalance }];
    chrono.forEach((t, i) => {
      running += Number(t.pnl);
      points.push({ name: `#${i + 1}`, saldo: running });
    });
    return points;
  }, [trades, initialBalance]);

  const hasData = trades.length > 0;
  const lastValue = hasData ? data[data.length - 1].saldo : initialBalance;
  const netChange = lastValue - initialBalance;
  const isPositive = netChange >= 0;

  // Solo se muestran metas si hay settings Y (es cuenta de fondeo, o es real con metas personales activadas)
  const showGoals = Boolean(settings) && (settings.account_type === "fondeo" || settings.has_personal_goals);

  const showTarget = showGoals && settings.profit_target;
  const showDaily = showGoals && settings.daily_limit;
  const showMax = showGoals && settings.max_limit;

  const legend = [{ label: "Saldo", color: "#22c55e", dash: false }];
  if (settings) legend.push({ label: "Saldo Inicial", color: "#22d3ee", dash: true });
  if (showTarget) legend.push({ label: settings.account_type === "fondeo" ? "Objetivo Firm" : "Meta Personal", color: "#eab308", dash: true });
  if (showDaily) legend.push({ label: "Reducción Diaria", color: "#f59e0b", dash: true });
  if (showMax) legend.push({ label: "Reducción Máxima", color: "#ef4444", dash: true });

  // Dominio del eje Y ajustado al rango real (no fuerza a incluir el 0),
  // así las líneas de referencia no quedan amontonadas arriba en cuentas grandes.
  const yDomain = useMemo(() => {
    if (!hasData) return ["auto", "auto"];

    const values = data.map((d) => d.saldo);
    let min = Math.min(...values, initialBalance);
    let max = Math.max(...values, initialBalance);

    if (showMax) min = Math.min(min, initialBalance - Number(settings.max_limit));
    if (showDaily) min = Math.min(min, initialBalance - Number(settings.daily_limit));
    if (showTarget) max = Math.max(max, initialBalance + Number(settings.profit_target));

    const range = max - min || Math.max(Math.abs(initialBalance) * 0.1, 100);
    const padding = range * 0.18;

    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [data, hasData, initialBalance, showMax, showDaily, showTarget, settings]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Curva de Saldo</span>
        </h3>
        {hasData && (
          <span className={`text-sm font-black font-mono ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
            {isPositive ? "+" : "-"}${Math.abs(netChange).toFixed(2)}
          </span>
        )}
      </div>

      {hasData ? (
        <div className={compact ? "h-48" : "h-72"}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 5, right: 55, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="saldoFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
              <YAxis
                domain={yDomain}
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={{ stroke: "#1e293b" }}
                tickLine={false}
                width={50}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{ background: "#0b0f17", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Saldo"]}
              />

              {settings && (
                <ReferenceLine y={initialBalance} stroke="#22d3ee" strokeDasharray="4 4" label={{ value: "Inicial", position: "left", fill: "#22d3ee", fontSize: 9 }} />
              )}
              {showTarget && (
                <ReferenceLine y={initialBalance + Number(settings.profit_target)} stroke="#eab308" strokeDasharray="4 4" label={{ value: "Meta", position: "right", fill: "#eab308", fontSize: 9 }} />
              )}
              {showDaily && (
                <ReferenceLine y={initialBalance - Number(settings.daily_limit)} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Diaria", position: "right", fill: "#f59e0b", fontSize: 9 }} />
              )}
              {showMax && (
                <ReferenceLine y={initialBalance - Number(settings.max_limit)} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Máxima", position: "left", fill: "#ef4444", fontSize: 9 }} />
              )}

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
        {legend.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.color, opacity: item.dash ? 0.6 : 1 }}
            />
            {item.label}
          </span>
        ))}
      </div>

      {(showTarget || showDaily || showMax) && (
        <p className="text-[9px] text-slate-600 font-mono text-center">
          * Reducción diaria se muestra como línea fija de referencia, no se recalcula día por día
          todavía.
        </p>
      )}
    </div>
  );
}

export default EquityChart;
