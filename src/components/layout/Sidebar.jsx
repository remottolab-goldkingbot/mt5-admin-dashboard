import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Cpu,
  Video,
  KeyRound,
  Users,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/panel", label: "Visión General SaaS", icon: LayoutDashboard, color: "text-amber-400" },
  { to: "/panel/software", label: "EAs e Indicadores", icon: Cpu, color: "text-cyan-400" },
  { to: "/panel/academia", label: "Academia & Cursos", icon: Video, color: "text-rose-400" },
  { to: "/panel/licencias/generar", label: "Licencias & MT4/MT5", icon: KeyRound, color: "text-emerald-400" },
  { to: "/panel/estudiantes", label: "Gestión de Alumnos", icon: Users, color: "text-blue-400" },
];

function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Overlay oscuro detras del drawer en movil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-64 lg:w-64 flex-shrink-0 space-y-2 font-sans lg:self-start lg:sticky lg:top-6 bg-brand-dark lg:bg-transparent p-4 lg:p-0 overflow-y-auto transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-2 lg:hidden">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">
            Menú
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase px-3 py-1 font-bold">
            Navegación Control
          </p>

          {NAV_ITEMS.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/40"
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              <Icon className={`w-4 h-4 ${color}`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Quick Server Stats Widget */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs mt-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
            Estado Servidores
          </span>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">API MQL5 License:</span>
              <span className="text-emerald-400 font-bold">OK (12ms)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">CDN Videos Vimeo:</span>
              <span className="text-emerald-400 font-bold">Activo</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Webhook TradingView:</span>
              <span className="text-cyan-400 font-bold">Escuchando</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
