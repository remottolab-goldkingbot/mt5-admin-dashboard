import { useAuth } from "../../context/AuthContext";
import { Plus, Activity, Radio } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const EQUITY_DEMO = [
  { v: 45280 }, { v: 46010 }, { v: 45700 }, { v: 46920 },
  { v: 47510 }, { v: 47100 }, { v: 48340 }, { v: 48920 },
];

const LIVE_TRADES = [
  { pair: "BUY XAUUSD", bot: "Gold Cascade EA", pnl: "+$380.00", color: "emerald" },
  { pair: "SELL EURUSD", bot: "Institutional Alpha", pnl: "-$95.00", color: "rose" },
  { pair: "BUY SOLUSDT", bot: "Solana Grid Master", pnl: "+$210.50", color: "emerald" },
];

const TEXT_COLOR = {
  emerald: "text-emerald-400",
  rose: "text-rose-400",
};

function Overview() {
  const { user } = useAuth();
  const firstName = (user?.name || "Alumno").split(" ")[0];

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
            Rendimiento semanal de EAs en MT5: <strong className="text-emerald-400 font-mono">+4.8%</strong>{" "}
            con drawdown máximo de <strong className="text-amber-400 font-mono">2.1%</strong>.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg gold-glow flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Registrar Trade</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">EQUIDAD TOTAL MT5</span>
          <div className="text-2xl font-black font-mono text-white mt-1">$48,920.40</div>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            +$3,640.00 este mes (+8.03%)
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">WIN RATE BOTS</span>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">83.4%</div>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">
            42 Operaciones Ganadas / 50
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">EAs ACTIVOS</span>
          <div className="text-2xl font-black font-mono text-white mt-1">3 / 3</div>
          <span className="text-[10px] font-mono text-emerald-400 block mt-1">
            Gold Cascade & Forex Alpha
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">PROGRESO ACADEMIA</span>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">68%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full" style={{ width: "68%" }} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Curva de Patrimonio Auditada (MT5 Live Server)</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={EQUITY_DEMO}>
                <Line type="monotone" dataKey="v" stroke="#d4af37" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Ejecuciones en Vivo VPS</span>
          </h3>
          <div className="space-y-2.5 font-mono text-xs">
            {LIVE_TRADES.map((t) => (
              <div key={t.pair} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <div>
                  <span className={`${TEXT_COLOR[t.color]} font-bold`}>{t.pair}</span>
                  <span className="text-[10px] text-slate-500 block">{t.bot}</span>
                </div>
                <span className={`${TEXT_COLOR[t.color]} font-bold`}>{t.pnl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Estos números son de ejemplo — cuando conectemos tu cuenta MT5 real, se reemplazan por datos en vivo.
      </p>
    </div>
  );
}

export default Overview;
