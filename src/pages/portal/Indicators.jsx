import { LineChart } from "lucide-react";

function Indicators() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Suite de Indicadores VIP</h2>
          <p className="text-xs text-slate-400">Gestión de licencias para TradingView.</p>
        </div>
        <div className="glass-panel px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-400">TradingView Username:</span>
          <span className="text-amber-400 font-bold ml-2">@MrStevalTrader</span>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="h-80 w-full bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center">
          <div className="text-center space-y-2">
            <LineChart className="w-14 h-14 text-cyan-400 mx-auto" />
            <p className="text-slate-500 text-xs font-mono">
              Vista previa de Order Blocks / FVG (demo)
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Cuando conectemos tu cuenta real de TradingView, aquí se muestra tu acceso y estado de
        licencia de los scripts invite-only.
      </p>
    </div>
  );
}

export default Indicators;
