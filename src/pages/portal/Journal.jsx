import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Lock, Crown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const INITIAL_TRADES = [
  { id: 1, date: "12/09/2026", asset: "XAUUSD", type: "BUY", emotion: "Confiado", pnl: 380.0 },
  { id: 2, date: "11/09/2026", asset: "EURUSD", type: "SELL", emotion: "Ansioso", pnl: -95.0 },
  { id: 3, date: "10/09/2026", asset: "SOLUSDT", type: "BUY", emotion: "Neutral", pnl: 210.5 },
];

const FREE_TRADE_LIMIT = 2;

function Journal() {
  const { user } = useAuth();
  const isPro = user?.membership === "pro";

  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ asset: "", type: "BUY", emotion: "Neutral", pnl: "" });

  const visibleTrades = isPro ? trades : trades.slice(0, FREE_TRADE_LIMIT);

  const addTrade = (e) => {
    e.preventDefault();
    if (!form.asset || form.pnl === "") return;

    setTrades((prev) => [
      {
        id: Date.now(),
        date: new Date().toLocaleDateString("es-CO"),
        asset: form.asset.toUpperCase(),
        type: form.type,
        emotion: form.emotion,
        pnl: parseFloat(form.pnl),
      },
      ...prev,
    ]);
    setForm({ asset: "", type: "BUY", emotion: "Neutral", pnl: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Bitácora de Trading (Mr.Steval Journal)
            {!isPro && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700">
                FREE
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">
            Registra tus entradas y evalúa tu psicología en tiempo real.
          </p>
        </div>

        {isPro ? (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg cyan-glow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Nuevo Trade</span>
          </button>
        ) : (
          <button
            disabled
            title="Disponible en el plan PRO"
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-extrabold text-xs flex items-center gap-2 cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            <span>Añadir Nuevo Trade</span>
          </button>
        )}
      </div>

      {!isPro && (
        <div className="glass-panel-gold rounded-2xl p-5 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">
                Estás viendo la versión Free del Journal
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Solo se muestran las últimas {FREE_TRADE_LIMIT} operaciones y no puedes agregar
                nuevas. Mejora a PRO para registro ilimitado y análisis completo.
              </p>
            </div>
          </div>
          <Link
            to="/#section-pricing"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg gold-glow whitespace-nowrap"
          >
            Mejorar a PRO
          </Link>
        </div>
      )}

      {showForm && isPro && (
        <form
          onSubmit={addTrade}
          className="glass-panel rounded-2xl p-4 border border-cyan-500/30 grid sm:grid-cols-5 gap-3 font-mono text-xs items-end"
        >
          <div>
            <label className="block text-slate-400 mb-1">ACTIVO</label>
            <input
              value={form.asset}
              onChange={(e) => setForm((f) => ({ ...f, asset: e.target.value }))}
              placeholder="XAUUSD"
              className="w-full glass-input p-2 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">TIPO</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full glass-input p-2 rounded-lg text-white"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">EMOCIÓN</label>
            <select
              value={form.emotion}
              onChange={(e) => setForm((f) => ({ ...f, emotion: e.target.value }))}
              className="w-full glass-input p-2 rounded-lg text-white"
            >
              <option>Confiado</option>
              <option>Neutral</option>
              <option>Ansioso</option>
              <option>Impulsivo</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">PNL ($)</label>
            <input
              type="number"
              step="0.01"
              value={form.pnl}
              onChange={(e) => setForm((f) => ({ ...f, pnl: e.target.value }))}
              placeholder="150.00"
              className="w-full glass-input p-2 rounded-lg text-white"
            />
          </div>
          <button
            type="submit"
            className="py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold"
          >
            Guardar
          </button>
        </form>
      )}

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="pb-3">FECHA</th>
                <th className="pb-3">ACTIVO</th>
                <th className="pb-3">TIPO</th>
                <th className="pb-3">EMOCIÓN</th>
                <th className="pb-3 text-right">PNL RESULTADO ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {visibleTrades.map((t) => (
                <tr key={t.id}>
                  <td className="py-3">{t.date}</td>
                  <td className="py-3">{t.asset}</td>
                  <td className="py-3">
                    <span className={t.type === "BUY" ? "text-emerald-400" : "text-rose-400"}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3">{t.emotion}</td>
                  <td className={`py-3 text-right font-bold ${t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.pnl >= 0 ? "+" : ""}
                    {t.pnl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isPro && trades.length > FREE_TRADE_LIMIT && (
            <div className="mt-3 py-3 text-center text-slate-500 border-t border-dashed border-slate-800">
              + {trades.length - FREE_TRADE_LIMIT} operaciones más disponibles solo en PRO
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Los trades que agregues aquí se guardan solo mientras tengas la página abierta — para
        que persistan de verdad hace falta una tabla de journal en el backend.
      </p>
    </div>
  );
}

export default Journal;
