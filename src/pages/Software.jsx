import { useState } from "react";
import { Cpu, UploadCloud, Bot, Zap, LineChart, Layers } from "lucide-react";

const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Gold Cascade Pro",
    subtitle: "MQL5 • MetaTrader 4 / 5",
    icon: Bot,
    color: "amber",
    badge: "v4.2 Estable",
    badgeColor: "emerald",
    fieldLabel: "URL DE DESCARGA BINARIO (.EX5):",
    value: "https://mrsteval.com/dl/gold-cascade-v4.2.ex5",
    footer: "Última mod: Hace 2 días",
  },
  {
    id: 2,
    name: "Solana Grid Master EA",
    subtitle: "Binance / Crypto API",
    icon: Zap,
    color: "cyan",
    badge: "v2.1 Beta",
    badgeColor: "cyan",
    fieldLabel: "URL DE DESCARGA ZIP:",
    value: "https://mrsteval.com/dl/solana-grid-v2.1.zip",
    footer: "Última mod: Hace 1 semana",
  },
  {
    id: 3,
    name: "Institutional Order Blocks",
    subtitle: "TradingView PineScript v5",
    icon: LineChart,
    color: "emerald",
    badge: "Invite-Only Script",
    badgeColor: "emerald",
    fieldLabel: "TRADINGVIEW SCRIPT ID / LINK:",
    value: "https://www.tradingview.com/script/steval-iob-v3/",
    footer: "Sincronizado con PineEngine",
  },
  {
    id: 4,
    name: "Liquidity Sweep Radar",
    subtitle: "TradingView + MetaTrader",
    icon: Layers,
    color: "rose",
    badge: "v1.8 Activo",
    badgeColor: "emerald",
    fieldLabel: "TRADINGVIEW SCRIPT ID / LINK:",
    value: "https://www.tradingview.com/script/steval-sweep-radar/",
    footer: "Acceso automático habilitado",
  },
];

const COLOR_MAP = {
  amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  rose: "bg-rose-500/10 border-rose-500/30 text-rose-400",
};

const BADGE_MAP = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
};

function Software() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [notice, setNotice] = useState("");

  const updateValue = (id, value) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, value } : i)));
  };

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Catálogo y Actualización de EAs & Indicadores</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Sube nuevas versiones de archivos .ex4/.ex5 y gestiona accesos de TradingView
          </p>
        </div>
        <button
          onClick={() => showNotice("Formulario de subida — próximamente")}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs font-mono shadow-lg transition-all flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Publicar Nueva Versión</span>
        </button>
      </div>

      {notice && <p className="text-amber-400 text-xs font-mono">{notice}</p>}

      <div className="grid md:grid-cols-2 gap-6 font-mono text-xs">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${COLOR_MAP[item.color]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <span className="text-[10px] text-slate-400">{item.subtitle}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] ${BADGE_MAP[item.badgeColor] || BADGE_MAP.emerald}`}
                >
                  {item.badge}
                </span>
              </div>

              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                <label className="block text-slate-400 text-[10px]">{item.fieldLabel}</label>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateValue(item.id, e.target.value)}
                  className="w-full glass-input p-2 rounded-lg text-slate-300 text-[11px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">{item.footer}</span>
                <button
                  onClick={() => showNotice(`"${item.name}" guardado (visual, sin backend aún)`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px]"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Esta sección es visual por ahora — para que "Guardar Cambios" persista de verdad,
        hay que crear una tabla de software/indicadores en el backend.
      </p>
    </div>
  );
}

export default Software;
