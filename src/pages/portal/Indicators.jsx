import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LineChart,
  Lock,
  CheckCircle,
  Pencil,
  Save,
  ExternalLink,
  BookOpen,
} from "lucide-react";

function Indicators() {
  const { user, updateUser } = useAuth();
  const isPro = user?.membership === "pro";
  const token = localStorage.getItem("token");

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState(user?.tradingview_username || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  const saveUsername = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/tradingview`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tradingview_username: usernameDraft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo guardar tu usuario");

      updateUser({ tradingview_username: data.tradingview_username });
      setEditingUsername(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Cabecera + TradingView username (real) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
              TradingView Integration
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Suite de Indicadores VIP</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de accesos y scripts exclusivos Invite-Only para Pine Script.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-4 min-w-[280px] font-mono">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
              TV
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 block">Usuario TradingView</span>
              {editingUsername ? (
                <input
                  type="text"
                  value={usernameDraft}
                  onChange={(e) => setUsernameDraft(e.target.value)}
                  placeholder="@tu_usuario"
                  className="glass-input text-xs px-2 py-1 rounded-lg text-white w-32"
                  autoFocus
                />
              ) : (
                <span className="text-xs font-bold text-amber-400 truncate block">
                  {user?.tradingview_username || "Sin registrar"}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => (editingUsername ? saveUsername() : setEditingUsername(true))}
            disabled={saving}
            className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            {editingUsername ? <Save className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
            {saving ? "..." : editingUsername ? "Guardar" : "Editar"}
          </button>
        </div>
      </div>

      {error && <p className="text-rose-400 text-xs font-mono">{error}</p>}

      {isPro ? (
        <>
          {/* Tarjeta del indicador (PRO = acceso real otorgado) */}
          <div className="glass-panel rounded-3xl border border-blue-500/30 overflow-hidden">
            <div className="p-6 border-b border-slate-800/80 bg-gradient-to-r from-blue-950/30 via-slate-900/50 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-xl shadow-lg shrink-0">
                  📈
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-white">Order Blocks & Liquidity FVG Suite</h2>
                    <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                      v3.2 PRO
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Detección automática de bloques de orden institucionales y desequilibrios de precio (Fair Value Gaps).
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-xl font-mono shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LICENCIA ACTIVA
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="space-y-3 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tipo de Acceso:</span>
                  <span className="text-slate-200 font-bold">Invite-Only Script</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nivel de Plan:</span>
                  <span className="text-amber-400 font-bold">VIP Quant PRO</span>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col justify-between gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-300">Acceso concedido en TradingView</p>
                    <p className="text-[11px] text-emerald-400/80 mt-0.5">
                      El indicador ya está disponible en tu cuenta{" "}
                      <strong className="text-white">
                        {user?.tradingview_username || "(registra tu usuario arriba)"}
                      </strong>{" "}
                      en la sección de Scripts con invitación.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://es.tradingview.com"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir en TradingView
                  </a>
                  <button
                    onClick={() => setShowTutorial((v) => !v)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    ¿Cómo agregarlo a mi gráfico?
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showTutorial && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                📌 Pasos para activar el indicador en tu gráfico de TradingView:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                {[
                  ["1", "Abre tu Gráfico", "Ingresa a TradingView y abre cualquier gráfico financiero (ej. XAUUSD, EURUSD)."],
                  ["2", "Menú Indicadores", 'Haz clic en el botón superior "Indicadores" (Fx) en la barra de herramientas.'],
                  ["3", "Scripts solo con invitación", 'Busca la pestaña "Requiere invitación" y haz clic en Order Blocks & FVG Suite.'],
                ].map(([n, title, desc]) => (
                  <div key={n} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center mb-2">
                      {n}
                    </span>
                    <p className="font-bold text-white mb-1">{title}</p>
                    <p className="text-slate-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 text-center space-y-4 grid-bg">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <LineChart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-mono">Order Blocks & Liquidity FVG Suite</h3>
          <p className="text-xs text-slate-400 font-mono max-w-xl mx-auto">
            Este indicador Invite-Only es exclusivo para miembros PRO. Regístrate tu usuario de
            TradingView arriba, y al mejorar tu plan te damos acceso directo en tu cuenta.
          </p>
          <Link
            to="/#section-pricing"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg gold-glow font-mono transition-all"
          >
            <Lock className="w-4 h-4" />
            Desbloquear en Plan PRO →
          </Link>
        </div>
      )}
    </div>
  );
}

export default Indicators;
