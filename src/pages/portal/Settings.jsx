import { useEffect, useState } from "react";
import { KeyRound, Clipboard, RefreshCw, ShieldCheck, ShieldOff } from "lucide-react";

function getExpiration(date) {
  if (!date) return "Vitalicia";
  const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "Expirada";
  return `${diff} días restantes`;
}

function Settings() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMyLicenses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/licenses/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudieron cargar tus licencias");
      setLicenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLicenses();
  }, []);

  const copyKey = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">Licencias & Ajustes de Cuenta</h2>
        <p className="text-xs text-slate-400">
          Estas son tus licencias reales — cópialas para activar tus EAs en MetaTrader.
        </p>
      </div>

      {loading && <p className="text-slate-500 text-xs font-mono">Cargando tus licencias...</p>}
      {error && <p className="text-rose-400 text-xs font-mono">{error}</p>}

      {!loading && !error && licenses.length === 0 && (
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center space-y-2">
          <KeyRound className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">
            Todavía no tienes ninguna licencia asignada a tu cuenta.
          </p>
          <p className="text-slate-500 text-xs font-mono">
            Cuando el equipo de Mr.Steval te genere una licencia con este mismo correo, va a
            aparecer aquí automáticamente.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 font-mono text-xs">
        {licenses.map((lic) => (
          <div key={lic.id} className="glass-panel-gold rounded-3xl p-6 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">LICENCIA EA</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 ${
                  lic.status === "active"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                }`}
              >
                {lic.status === "active" ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <ShieldOff className="w-3 h-3" />
                )}
                {lic.status === "active" ? "Activa" : "Revocada"}
              </span>
            </div>

            <div
              onClick={() => copyKey(lic.license_key, lic.id)}
              className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-amber-500/40"
            >
              <span className="text-amber-300 font-bold text-sm truncate">
                {lic.license_key}
              </span>
              <Clipboard className="w-4 h-4 text-slate-500 shrink-0" />
            </div>
            {copiedId === lic.id && (
              <span className="text-emerald-400 text-[10px] block -mt-2">
                Copiado — pégala en el campo de licencia del EA
              </span>
            )}

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400">Cuenta MT vinculada:</span>
                <span className="text-white">{lic.account_number || "Aún no vinculada"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duración:</span>
                <span className="text-white">{lic.plan || "Vitalicia"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vigencia:</span>
                <span className="text-white">{getExpiration(lic.expires_at)}</span>
              </div>
            </div>

            {!lic.account_number && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">
                <RefreshCw className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Pega esta clave en el EA dentro de MetaTrader y ábrelo una vez — tu cuenta
                  MT4/MT5 se vincula sola en ese momento.
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Estas licencias son 100% reales — vienen directo de la base de datos, no son de ejemplo.
      </p>
    </div>
  );
}

export default Settings;
