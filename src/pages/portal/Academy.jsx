import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const MODULES = [
  {
    unit: "UNIDAD 1",
    unitColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    badge: "GRATIS",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    gradient: "from-blue-900/40",
    icon: "🎯",
    title: "1. Temario Básico",
    desc: "En esta etapa construirás las bases necesarias para iniciar tu camino en el trading algorítmico y uso de plataformas.",
    progress: 100,
    pro: false,
  },
  {
    unit: "UNIDAD 2",
    unitColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    badge: "PRO",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    gradient: "from-purple-900/40",
    icon: "🔥",
    title: "2. Temario Intermedio",
    desc: "Aquí comenzarás a desarrollar una visión más técnica del mercado, lógica de EAs y optimización de parámetros.",
    progress: 0,
    pro: true,
  },
  {
    unit: "UNIDAD 3",
    unitColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    badge: "PRO",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    gradient: "from-amber-900/40",
    icon: "🚀",
    title: "3. Temario Avanzado",
    desc: "Lleva tu operativa a un enfoque cuantitativo institucional. Portafolios multi-bot y gestión de riesgo extrema.",
    progress: 0,
    pro: true,
  },
  {
    unit: "RECORDINGS",
    unitColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    badge: "PRO",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    gradient: "from-cyan-900/40",
    icon: "🎬",
    title: "Biblioteca de Sesiones",
    desc: "Revive cada clase en vivo cuando quieras. Grabaciones de análisis de mercado y backtesting grupal.",
    progress: 0,
    pro: true,
  },
  {
    unit: "RECURSOS",
    unitColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    badge: "PRO",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    gradient: "from-emerald-900/40",
    icon: "💎",
    title: "BONUS & Archivos .SET",
    desc: "Contenido exclusivo con configuraciones de EAs, plantillas para cuentas de fondeo y utilidades.",
    progress: 0,
    pro: true,
  },
];

function Academy() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPro = user?.membership === "pro";

  const globalProgress = isPro ? "65%" : "20%";
  const globalModules = isPro ? "5 / 5" : "1 / 5";

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Academia Quant & Formación Institucional
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Módulos educativos interactivos para el desarrollo de sistemas algorítmicos.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto font-mono">
          <div className="glass-panel p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Progreso Total</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-extrabold text-amber-400">{globalProgress}</span>
              <span className="text-[10px] text-slate-500">completado</span>
            </div>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Módulos Acceso</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-extrabold text-white">{globalModules}</span>
              <span className="text-[10px] text-slate-500">desbloqueados</span>
            </div>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase block">Estatus Plan</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${isPro ? "bg-emerald-400" : "bg-slate-500"}`} />
              <span className={`text-xs font-bold ${isPro ? "text-emerald-400" : "text-slate-400"}`}>
                {isPro ? "Miembro PRO Quant" : "Estándar Free"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {MODULES.map((m, i) => {
          const locked = m.pro && !isPro;
          return (
            <div
              key={m.title}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between relative"
            >
              {locked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-2 shadow-lg">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white mb-1">Exclusivo Plan PRO</span>
                  <button className="bg-amber-500 text-black font-extrabold text-[11px] px-4 py-2 rounded-lg shadow-md hover:bg-amber-400 transition-all">
                    Desbloquear Módulo
                  </button>
                </div>
              )}

              <div>
                <div className={`relative h-32 bg-gradient-to-br ${m.gradient} to-slate-900 p-4 flex flex-col justify-between overflow-hidden`}>
                  <div className="relative z-10 flex justify-between items-center">
                    <span className={`text-[10px] font-extrabold border px-2.5 py-1 rounded-md uppercase ${m.unitColor}`}>
                      {m.unit}
                    </span>
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black text-white italic tracking-wider uppercase">{m.title.split(". ").pop()}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                    <span>{m.icon}</span> {m.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between text-slate-400 mb-1.5">
                  <span>Progreso</span>
                  <span className={m.progress > 0 ? "text-amber-400 font-bold" : "text-slate-500 font-bold"}>
                    {m.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${m.progress}%` }} />
                </div>
                <button
                  disabled={locked}
                  onClick={() => !locked && navigate(`/portal/academia/${i + 1}`)}
                  className={`w-full font-bold text-xs py-2.5 rounded-xl transition-all ${
                    locked
                      ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
                      : "bg-slate-800 hover:bg-amber-500 hover:text-black text-white"
                  }`}
                >
                  Ingresar al Módulo
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * El bloqueo Free/PRO ya es real según tu plan. El contenido de las lecciones (videos, PDFs) y el % de
        progreso siguen siendo de ejemplo hasta que carguemos contenido real.
      </p>
    </div>
  );
}

export default Academy;
