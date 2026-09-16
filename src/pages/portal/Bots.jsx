import { useState } from "react";
import { Download } from "lucide-react";

const INITIAL_BOTS = [
  {
    id: 1,
    name: "Gold Cascade Pro v4.2",
    desc: "Operativa XAU/USD con trailing stop automático.",
    risk: 1.5,
    min: 0.5,
    max: 5.0,
    profit: "+$1,450.00 Profit",
    accent: "amber",
  },
  {
    id: 2,
    name: "Forex Institutional Alpha",
    desc: "Order Blocks institucionales en divisas mayores.",
    risk: 1.0,
    min: 0.5,
    max: 3.0,
    profit: "+$1,120.00 Profit",
    accent: "blue",
  },
  {
    id: 3,
    name: "Solana Grid Master EA",
    desc: "Grid cuantitativo en Binance/Bybit.",
    risk: 1.2,
    min: 0.5,
    max: 3.0,
    profit: "+$1,070.00 Profit",
    accent: "cyan",
  },
];

const RISK_TEXT = {
  amber: "text-amber-400",
  blue: "text-blue-400",
  cyan: "text-cyan-400",
};

function Bots() {
  const [bots, setBots] = useState(INITIAL_BOTS);
  const [notice, setNotice] = useState("");

  const updateRisk = (id, value) => {
    setBots((prev) => prev.map((b) => (b.id === id ? { ...b, risk: value } : b)));
  };

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Centro de Control de EAs (Robots MT4/MT5)</h2>
          <p className="text-xs text-slate-400">
            Ajusta lotaje y riesgo por operación transmitido directamente a tu servidor VPS.
          </p>
        </div>
        <button
          onClick={() => showNotice("Descarga de archivos .EX4/.EX5 — próximamente")}
          className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-lg gold-glow flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Archivos .EX4/.EX5</span>
        </button>
      </div>

      {notice && <p className="text-amber-400 text-xs font-mono">{notice}</p>}

      <div className="grid md:grid-cols-3 gap-6 font-mono text-xs">
        {bots.map((bot) => (
          <div key={bot.id} className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">{bot.name}</h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                ONLINE
              </span>
            </div>
            <p className="text-slate-400">{bot.desc}</p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Riesgo por trade:</span>
                <span className={`font-bold ${RISK_TEXT[bot.accent]}`}>{bot.risk}%</span>
              </div>
              <input
                type="range"
                min={bot.min}
                max={bot.max}
                step="0.1"
                value={bot.risk}
                onChange={(e) => updateRisk(bot.id, parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-emerald-400 font-bold">{bot.profit}</span>
              <button
                onClick={() => showNotice(`Riesgo de "${bot.name}" guardado (visual, sin backend aún)`)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * El riesgo se guarda visualmente por ahora — para transmitirlo de verdad al VPS/EA hace
        falta un endpoint nuevo en el backend.
      </p>
    </div>
  );
}

export default Bots;
