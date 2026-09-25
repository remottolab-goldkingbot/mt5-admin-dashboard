import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Lock,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Contenido de ejemplo del Módulo 1 (el único con datos de muestra por ahora)
const MODULE_1 = {
  title: "1. Temario Básico",
  progress: 40,
  lessons: [
    { id: 1, title: "1.1 Introducción a la Unidad 1", duration: "00:52 min", pro: false, done: false, desc: "En este video introductorio conocerás la visión general de la Unidad 1. Aprenderás a estructurar tu entorno de trabajo en MetaTrader 5, gestionar la ejecución de bots y comprender la psicología operativa necesaria antes de arriesgar capital real." },
    { id: 2, title: "1.2 ¿Qué son los mercados financieros?", duration: "08:15 min", pro: false, done: true, desc: "Fundamentos de qué es un mercado financiero, cómo se forman los precios y quiénes participan." },
    { id: 3, title: "1.3 Cómo podemos invertir en los mercados", duration: "12:40 min", pro: false, done: false, desc: "Panorama de las formas de invertir: acciones, forex, cripto y derivados." },
    { id: 4, title: "1.4 Cómo configurar la plataforma de trading", duration: "15:00 min", pro: false, done: false, desc: "Instalación y configuración inicial de MetaTrader 5 para operar con tus EAs." },
    { id: 5, title: "1.5 Estrategia Avanzada con EAs", duration: "22:10 min", pro: true, done: false, desc: "Estrategias avanzadas de trading algorítmico y plantillas optimizadas para cuentas institucionales." },
    { id: 6, title: "1.6 Qué son las velas japonesas, pips y lotaje", duration: "18:30 min", pro: false, done: false, desc: "Lectura de velas japonesas y cómo se calcula el valor de un pip y el tamaño del lote." },
    { id: 7, title: "1.7 Take Profit, Stop Loss y Tipos de órdenes", duration: "14:20 min", pro: false, done: false, desc: "Tipos de órdenes en MetaTrader y cómo proteger tu capital con SL/TP." },
  ],
};

const RESOURCES = [
  { name: "Config_Conservadora_EURUSD.set", size: "12 KB • Plantilla MT5", tag: ".SET", color: "amber" },
  { name: "Guía_Gestion_Riesgo.pdf", size: "2.4 MB • Documento", tag: "PDF", color: "blue" },
];

function AcademyLesson() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPro = user?.membership === "pro";

  const [completed, setCompleted] = useState(() => new Set(MODULE_1.lessons.filter((l) => l.done).map((l) => l.id)));
  const [activeId, setActiveId] = useState(1);

  if (moduleId !== "1") {
    return (
      <div className="space-y-6 font-sans">
        <button
          onClick={() => navigate("/portal/academia")}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-all w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Temarios
        </button>
        <div className="glass-panel p-10 rounded-3xl border border-slate-800 text-center">
          <p className="text-slate-400 text-sm font-mono">
            Este módulo todavía no tiene lecciones cargadas — vuelve pronto.
          </p>
        </div>
      </div>
    );
  }

  const active = MODULE_1.lessons.find((l) => l.id === activeId);
  const activeIndex = MODULE_1.lessons.findIndex((l) => l.id === activeId);
  const isLocked = active.pro && !isPro;

  const toggleComplete = () => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(activeId) ? next.delete(activeId) : next.add(activeId);
      return next;
    });
  };

  const goPrev = () => {
    if (activeIndex > 0) setActiveId(MODULE_1.lessons[activeIndex - 1].id);
  };
  const goNext = () => {
    if (activeIndex < MODULE_1.lessons.length - 1) setActiveId(MODULE_1.lessons[activeIndex + 1].id);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => navigate("/portal/academia")}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Temarios
        </button>
        <span className="text-slate-700">/</span>
        <span className="text-xs text-slate-400 font-mono">{MODULE_1.title}</span>
        <span className="text-slate-700">/</span>
        <span className="text-xs text-amber-400 font-medium truncate">{active.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lista de lecciones */}
        <aside className="lg:col-span-4 glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col lg:sticky lg:top-6">
          <div className="p-5 border-b border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-white flex items-center gap-2">
                📚 {MODULE_1.title}
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">{MODULE_1.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${MODULE_1.progress}%` }} />
            </div>
          </div>

          <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
            {MODULE_1.lessons.map((lesson) => {
              const isActive = lesson.id === activeId;
              const locked = lesson.pro && !isPro;
              const done = completed.has(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveId(lesson.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 font-mono ${
                    isActive
                      ? "bg-amber-500/10 border-amber-500/40"
                      : "bg-slate-900/40 hover:bg-slate-900 border-slate-800/60"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5 ${
                      isActive
                        ? "bg-amber-500 text-black"
                        : locked
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : done
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isActive ? <Play className="w-3 h-3" /> : locked ? <Lock className="w-3 h-3" /> : done ? "✓" : lesson.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-bold truncate ${isActive ? "text-amber-400" : "text-slate-300"}`}>
                        {lesson.title}
                      </p>
                      {lesson.pro && (
                        <span className="text-[8px] bg-amber-500/20 text-amber-400 font-extrabold px-1 rounded shrink-0">
                          PRO
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{lesson.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Player + recursos */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                Lección {activeIndex + 1}
              </span>
              <h1 className="text-xl font-extrabold text-white mt-2">{active.title.replace(/^\d\.\d\s*/, "")}</h1>
            </div>

            {!isLocked && (
              <button
                onClick={toggleComplete}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 border ${
                  completed.has(activeId)
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-500/50 hover:text-emerald-400"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completed.has(activeId) ? "¡Completada!" : "Marcar como completada"}
              </button>
            )}
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 relative bg-black shadow-2xl">
            {isLocked ? (
              <div className="aspect-video bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-white mb-2">Lección Exclusiva para Miembros PRO</h3>
                <p className="text-xs text-slate-400 max-w-lg mb-6">
                  Esta clase contiene estrategias avanzadas de trading algorítmico y plantillas optimizadas para
                  cuentas institucionales.
                </p>
                <Link
                  to="/#section-pricing"
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all"
                >
                  ⚡ Desbloquear Acceso PRO Ahora
                </Link>
              </div>
            ) : (
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
                <button className="relative z-10 w-20 h-20 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                <div className="absolute bottom-0 inset-x-0 p-4 z-10 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="text-amber-400">▶ 00:00 / {active.duration}</span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">Audio ES</span>
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5 font-mono text-xs">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Resumen de la Clase</h3>
              <p className="text-slate-400 leading-relaxed">{active.desc}</p>
            </div>

            <div>
              <h3 className="text-[11px] uppercase text-slate-400 mb-3 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Archivos Adjuntos de esta clase
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RESOURCES.map((r) => (
                  <div
                    key={r.name}
                    className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg font-bold text-[10px] flex items-center justify-center shrink-0 ${
                          r.color === "amber"
                            ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                            : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                        }`}
                      >
                        {r.tag}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{r.name}</p>
                        <span className="text-[10px] text-slate-500">{r.size}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert("Descarga de archivos — próximamente")}
                      className="bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-300 p-2 rounded-lg transition-all shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={goPrev}
              disabled={activeIndex === 0}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold px-4 py-3 rounded-xl transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Clase Anterior
            </button>
            <button
              onClick={goNext}
              disabled={activeIndex === MODULE_1.lessons.length - 1}
              className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Siguiente Clase <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Contenido de ejemplo — el bloqueo PRO de la lección 1.5 ya es real según tu plan. Los videos y
        archivos reales se cargan más adelante.
      </p>
    </div>
  );
}

export default AcademyLesson;
