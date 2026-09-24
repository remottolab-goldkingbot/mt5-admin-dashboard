import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, AlertTriangle, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const FREE_DAILY_LIMIT = 3;
const OVERTRADE_THRESHOLD = 6;

const MOTIVATIONAL = [
  "Opera con disciplina, no con emoción.",
  "Un buen trade es el que sigue tu plan, gane o pierda.",
  "La paciencia paga más que la prisa.",
  "Protege tu capital antes que tu ego.",
  "Hoy no busques revancha, busca proceso.",
  "Menos operaciones, más calidad.",
  "Tu peor enemigo hoy es la impulsividad.",
  "El mercado estará ahí mañana. Tu capital, cuídalo hoy.",
];

function JournalWelcomeModal() {
  const { user } = useAuth();
  const isPro = user?.membership === "pro";
  const [visible, setVisible] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/journal/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const today = new Date().toDateString();
          const count = data.filter((t) => new Date(t.created_at).toDateString() === today).length;
          setTodayCount(count);
        }
      } catch {
        // silencioso: el modal es un extra, no debe romper la pantalla si falla
      } finally {
        setLoaded(true);
        setVisible(true);
      }
    };
    load();
  }, []);

  if (!loaded || !visible) return null;

  const overtrading = isPro ? todayCount >= OVERTRADE_THRESHOLD : todayCount >= FREE_DAILY_LIMIT;
  const remaining = FREE_DAILY_LIMIT - todayCount;
  const phrase = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 font-sans"
      onClick={() => setVisible(false)}
    >
      <div
        className={`glass-panel rounded-3xl p-8 w-full max-w-sm text-center space-y-4 border ${
          overtrading ? "border-rose-500/40" : "border-amber-500/30"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {overtrading ? (
          <>
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h2 className="text-white font-bold text-lg">Cuidado con el sobre-trading</h2>
            {isPro ? (
              <p className="text-slate-400 text-xs font-mono">
                Ya registraste <strong className="text-rose-400">{todayCount} operaciones hoy</strong>.
                Respeta tu plan de riesgo — más operaciones no siempre significa más ganancias.
              </p>
            ) : (
              <p className="text-slate-400 text-xs font-mono">
                Ya usaste tus <strong className="text-rose-400">3 registros gratuitos de hoy</strong>.
                Mejora a PRO para registro ilimitado y sigue tu día sin cortes.
              </p>
            )}
            {!isPro && (
              <Link
                to="/#section-pricing"
                className="block w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono"
              >
                Ver Plan PRO
              </Link>
            )}
          </>
        ) : (
          <>
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
            <h2 className="text-white font-bold text-lg">
              {todayCount === 0 ? "¡Buena sesión de trading!" : "Sigue así"}
            </h2>
            <p className="text-slate-300 text-sm font-mono italic">"{phrase}"</p>
            {!isPro && (
              <p className="text-slate-500 text-[11px] font-mono">
                Te quedan <strong className="text-amber-400">{remaining}</strong> registro
                {remaining !== 1 ? "s" : ""} gratuito{remaining !== 1 ? "s" : ""} hoy.
              </p>
            )}
          </>
        )}

        <button
          onClick={() => setVisible(false)}
          className="text-slate-500 hover:text-white text-xs font-mono flex items-center gap-1 mx-auto pt-1"
        >
          <X className="w-3.5 h-3.5" />
          Cerrar y continuar
        </button>
      </div>
    </div>
  );
}

export default JournalWelcomeModal;
