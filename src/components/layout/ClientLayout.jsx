import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Bot,
  LineChart,
  GraduationCap,
  BookOpen,
  Sliders,
  Server,
  LogOut,
  Crown,
  Search,
  Send,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/portal", label: "Resumen & General", icon: LayoutDashboard, end: true },
  { to: "/portal/bots", label: "EAs & Robots", icon: Bot, badge: "3 Live", badgeColor: "amber" },
  { to: "/portal/indicadores", label: "Indicadores VIP", icon: LineChart },
  { to: "/portal/academia", label: "Academia & Cursos", icon: GraduationCap },
  { to: "/portal/journal", label: "Trading Journal", icon: BookOpen, badge: "PRO", badgeColor: "cyan", iconColor: "text-cyan-400" },
  { to: "/portal/ajustes", label: "Licencias & Ajustes", icon: Sliders },
];

const BADGE_COLORS = {
  amber: "bg-amber-500/20 text-amber-300",
  cyan: "bg-cyan-500/20 text-cyan-300",
  slate: "bg-slate-700/60 text-slate-300",
};

function ClientLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPro = user?.membership === "pro";

  const navItems = NAV_ITEMS.map((item) =>
    item.to === "/portal/journal"
      ? { ...item, badge: isPro ? "PRO" : "FREE", badgeColor: isPro ? "cyan" : "slate" }
      : item
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 font-sans flex">
      {/* Overlay oscuro detras del drawer en movil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR — fijo y visible siempre desde lg, drawer deslizable antes de eso */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-64 bg-[#0b0f17] border-r border-slate-800/80 flex flex-col justify-between shrink-0 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="overflow-y-auto">
          <div className="h-16 px-6 flex items-center justify-between gap-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center font-bold text-black font-mono text-base">
                MS
              </div>
              <span className="text-base font-extrabold text-white block leading-none">
                Mr.Steval
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-slate-800/60">
            {user?.membership === "pro" ? (
              <div className="glass-panel-gold rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white block truncate">
                    Membresía PRO
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />{" "}
                    Activa
                  </span>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-xl p-3 flex items-center gap-3 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white block truncate">Plan Free</span>
                  <span className="text-[10px] font-mono text-slate-500">Acceso limitado</span>
                </div>
              </div>
            )}
          </div>

          <nav className="p-4 space-y-1.5 text-xs font-medium">
            {navItems.map(({ to, label, icon: Icon, end, badge, badgeColor, iconColor }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${iconColor || ""}`} />
                <span className="flex-1 text-left">{label}</span>
                {badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded ${BADGE_COLORS[badgeColor]}`}
                  >
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="glass-panel p-3 rounded-xl text-xs space-y-1 font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" /> VPS Status
              </span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>IP: 185.220.xx.12</span>
              <span>1.8ms Latency</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0b0f17]/90 border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-300 hover:text-white shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative hidden sm:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar EA, lección, ticket..."
                className="w-full glass-input rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href="#"
              className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Canal VIP Telegram</span>
            </a>

            <div className="flex items-center gap-2.5 pl-0 sm:pl-2 sm:border-l border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-black text-xs shrink-0">
                {(user?.name || user?.email || "MS").slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="text-xs font-bold text-white block">
                  {user?.name || user?.email}
                </span>
                <span className="text-[9px] font-mono text-amber-400">
                  ID: #MS-{String(user?.id || "00000").padStart(5, "0")}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}

export default ClientLayout;
