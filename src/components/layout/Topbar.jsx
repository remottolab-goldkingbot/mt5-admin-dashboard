import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Menu } from "lucide-react";

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f17]/90 border-b border-white/10 px-3 sm:px-6 py-3 sm:py-3.5 backdrop-blur-md flex items-center justify-between gap-2 shadow-2xl font-sans">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-300 hover:text-white shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center font-bold text-white font-mono text-base sm:text-lg shadow-lg gold-glow">
          MS
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-white block leading-none truncate">
              Mr.Steval Admin SaaS
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase shrink-0">
              Master Control
            </span>
          </div>
          <span className="hidden sm:block text-[10px] font-mono tracking-wider text-slate-400 uppercase">
            Ecosistema Global de Trading
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-mono shrink-0">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Servicios SaaS: 100% Online</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 max-w-[160px] md:max-w-none">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">{user?.email || "SuperAdmin"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/30 px-2.5 sm:px-3 py-1.5 rounded-xl text-slate-300 hover:text-rose-400 font-bold"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
