import { useState } from "react";
import { Video, PlusCircle, Save, Trash2 } from "lucide-react";

const MODULES = {
  m1: {
    label: "Módulo 1: Fundamentos de Trading Algorítmico",
    videos: [
      {
        id: 1,
        title: "Introducción al Algorithmic Trading con Gold Cascade",
        meta: "Duración: 18 min • ID Vimeo: 849201948",
        url: "https://player.vimeo.com/video/849201948",
      },
      {
        id: 2,
        title: "Instalación e Importación de Parámetros Setfiles",
        meta: "Duración: 25 min • ID Vimeo: 910283719",
        url: "https://player.vimeo.com/video/910283719",
      },
      {
        id: 3,
        title: "Gestión de Riesgo y Drawdown Control con Grid",
        meta: "Duración: 32 min • ID Vimeo: 992018471",
        url: "https://player.vimeo.com/video/992018471",
      },
    ],
  },
  m2: { label: "Módulo 2: Configuración Avanzada de EAs en VPS", videos: [] },
  m3: { label: "Módulo 3: Smart Money Concepts & Liquidez", videos: [] },
};

function Academy() {
  const [moduleId, setModuleId] = useState("m1");
  const [modules, setModules] = useState(MODULES);
  const [notice, setNotice] = useState("");

  const currentVideos = modules[moduleId]?.videos || [];

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 2500);
  };

  const updateVideoUrl = (id, url) => {
    setModules((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        videos: prev[moduleId].videos.map((v) => (v.id === id ? { ...v, url } : v)),
      },
    }));
  };

  const removeVideo = (id) => {
    setModules((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        videos: prev[moduleId].videos.filter((v) => v.id !== id),
      },
    }));
  };

  const addVideo = () => {
    const title = window.prompt("Título de la nueva lección del curso:");
    if (!title) return;
    const url = window.prompt(
      "URL del video (Vimeo/Wistia/YouTube Embed):",
      "https://player.vimeo.com/video/123456789"
    );
    if (!url) return;

    setModules((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        videos: [
          ...prev[moduleId].videos,
          { id: Date.now(), title, meta: "Recién añadido • Enlace actualizado", url },
        ],
      },
    }));
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 glass-panel-rose rounded-3xl border border-rose-500/30">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-400" />
            <span>Gestor CMS de Cursos y Videos</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Actualiza enlaces de videos de Vimeo/Wistia, añade clases y sube recursos adjuntos
          </p>
        </div>
        <button
          onClick={addVideo}
          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs font-mono shadow-lg transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Añadir Nueva Lección</span>
        </button>
      </div>

      {notice && <p className="text-emerald-400 text-xs font-mono">{notice}</p>}

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <label className="text-slate-400">SELECCIONAR MÓDULO:</label>
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="glass-input p-2 rounded-xl text-white"
            >
              {Object.entries(modules).map(([key, mod]) => (
                <option key={key} value={key}>
                  {mod.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-amber-400 text-[11px]">
            Total: {currentVideos.length} Lecciones en este módulo
          </span>
        </div>

        <div className="space-y-4">
          {currentVideos.map((video, index) => (
            <div
              key={video.id}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{video.title}</h4>
                  <p className="text-[10px] text-slate-500">{video.meta}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  value={video.url}
                  onChange={(e) => updateVideoUrl(video.id, e.target.value)}
                  className="glass-input p-2 rounded-xl text-slate-300 text-[11px] w-full md:w-72"
                />
                <button
                  onClick={() => showNotice("Video guardado (visual, sin backend aún)")}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/40 font-bold"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeVideo(video.id)}
                  className="px-3 py-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/40 font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {currentVideos.length === 0 && (
            <p className="text-slate-500 text-center py-4">Este módulo no tiene lecciones todavía.</p>
          )}
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Los módulos y videos son de ejemplo — cuando conectemos una tabla de cursos en el
        backend, esto pasa a guardarse de verdad.
      </p>
    </div>
  );
}

export default Academy;
