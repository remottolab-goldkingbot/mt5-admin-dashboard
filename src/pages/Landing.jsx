import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Zap,
  TrendingUp,
  Layers,
  CheckCircle,
  Check,
  X,
  LineChart,
  LogIn,
  Lock,
} from "lucide-react";
import {
  LineChart as RLineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const EQUITY_DEMO = [
  { v: 10000 },
  { v: 10240 },
  { v: 10180 },
  { v: 10620 },
  { v: 11040 },
  { v: 10890 },
  { v: 11530 },
  { v: 12010 },
];

const BOTS = [
  {
    icon: Zap,
    color: "amber",
    badge: "TOP SELLER",
    name: "Gold Cascade Pro v4.2",
    desc: "Especializado en XAU/USD con lectura de volumen institucional y trailing stop dinámico.",
    stats: [
      ["Win Rate:", "85.4%", "text-emerald-400"],
      ["Apalancamiento:", "1:30 a 1:100", "text-white"],
      ["Compatibilidad:", "MT4 / MT5", "text-amber-400"],
    ],
    price: "$299 USD",
  },
  {
    icon: TrendingUp,
    color: "blue",
    badge: "INSTITUCIONAL",
    name: "Forex Institutional Alpha",
    desc: "Sigue estructura de mercado y liquidez institucional en pares mayores con gestión de riesgo estricta.",
    stats: [
      ["Win Rate:", "78.1%", "text-emerald-400"],
      ["Apalancamiento:", "1:20 a 1:50", "text-white"],
      ["Compatibilidad:", "MT4 / MT5", "text-blue-400"],
    ],
    price: "$249 USD",
  },
  {
    icon: Layers,
    color: "cyan",
    badge: "CRYPTO",
    name: "Solana Grid Master EA",
    desc: "Estrategia de grilla adaptativa para pares cripto de alta volatilidad, con control de drawdown.",
    stats: [
      ["Win Rate:", "71.9%", "text-emerald-400"],
      ["Apalancamiento:", "Spot / Futuros", "text-white"],
      ["Compatibilidad:", "Binance API", "text-cyan-400"],
    ],
    price: "$199 USD",
  },
];

const PLANS = [
  {
    tag: "MEMBRESÍA BÁSICA",
    tagColor: "text-slate-400",
    name: "Starter Quant",
    price: "$99",
    period: "/ mes",
    highlight: false,
    features: [
      ["Acceso a 1 Robot EA a elección", true],
      ["Indicadores Básicos TradingView", true],
      ["Acceso a Trading Journal App", true],
      ["Cursos de Programación MQL5", false],
    ],
    cta: "Comenzar Starter",
  },
  {
    tag: "ACCESO LIFETIME",
    tagColor: "text-amber-400",
    name: "VIP Pro Pass",
    price: "$499",
    period: "pago único",
    highlight: true,
    badge: "MÁS POPULAR",
    features: [
      ["Todos los 3 Robots EAs (MT4/MT5)", true],
      ["Indicadores VIP Invite-Only ilimitados", true],
      ["Curso Completo de Academia Quant", true],
      ["Soporte de VPS Configurado", true],
    ],
    cta: "Obtener Membresía VIP Pro",
  },
  {
    tag: "ACADEMIA SOLA",
    tagColor: "text-cyan-400",
    name: "Academy Only",
    price: "$199",
    period: "pago único",
    highlight: false,
    features: [
      ["Formación en SMC & Market Structure", true],
      ["Acceso a comunidad privada", true],
      ["Certificado de finalización", true],
      ["Robots EAs no incluidos", false],
    ],
    cta: "Comenzar Academy Only",
  },
];

const BOT_COLOR = {
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-500/50 group-hover:text-amber-400",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:border-blue-500/50 group-hover:text-blue-400",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-500/50 group-hover:text-cyan-400",
};

function Landing() {
  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 font-sans">
      {/* NAVBAR */}
      <nav className="border-b border-slate-800/80 bg-[#070a0f]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 flex items-center justify-center font-bold text-black font-mono text-xl shadow-lg gold-glow">
              MS
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                Mr.Steval
              </span>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                Trading Academy
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#section-bots" className="text-slate-300 hover:text-amber-400 transition-colors">
              Robots & EAs
            </a>
            <a href="#section-indicators" className="text-slate-300 hover:text-cyan-400 transition-colors">
              Indicadores VIP
            </a>
            <a href="#section-journal" className="text-slate-300 hover:text-amber-400 transition-colors">
              Trading Journal App
            </a>
            <a href="#section-pricing" className="text-slate-300 hover:text-amber-400 transition-colors">
              Membresías
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-lg gold-glow hover:scale-105 transition-all flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso Alumnos</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="relative pt-12 pb-20 overflow-hidden grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>ESTRATEGIA CUANTITATIVA & ROBOTS AUDITADOS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Automatiza tu Trading. <br />
                <span className="text-gradient-gold">Domina los Mercados.</span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                Accede a la suite completa de <strong>Robots de Trading (EAs)</strong>,{" "}
                <strong>Indicadores Institucionales</strong> en TradingView y nuestra{" "}
                <strong>Bitácora Inteligente (Journal App)</strong> para escalar cuentas de
                fondeo y capital propio.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#section-bots"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-lg gold-glow transition-all flex items-center gap-2"
                >
                  <span>Explorar Algoritmos</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#section-journal"
                  className="px-6 py-3.5 rounded-xl glass-panel hover:border-cyan-500/50 text-white font-bold text-sm transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Probar Trading Journal</span>
                </a>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 font-mono text-center lg:text-left">
                <div>
                  <span className="text-2xl font-black text-white block">+84.2%</span>
                  <span className="text-xs text-slate-500">Win-Rate Promedio</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-amber-400 block">$4.8M+</span>
                  <span className="text-xs text-slate-500">Gestionado en EAs</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-cyan-400 block">1,400+</span>
                  <span className="text-xs text-slate-500">Estudiantes Activos</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="glass-panel-gold rounded-3xl p-6 border border-amber-500/30 gold-glow space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">EQUITY — Gold Cascade Pro</span>
                  <span className="text-emerald-400 font-bold">+20.1%</span>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <RLineChart data={EQUITY_DEMO}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke="#d4af37"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </RLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Balance</span>
                    <span className="text-white font-bold">$12,010</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Drawdown</span>
                    <span className="text-rose-400 font-bold">2.4% Estricto</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Trades</span>
                    <span className="text-white font-bold">312</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTS */}
      <section id="section-bots" className="py-20 border-t border-slate-800/80 bg-[#0b0f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              Sistemas Algorítmicos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Robots de Trading (EAs MetaTrader 4/5)
            </h2>
            <p className="text-slate-400 text-sm">
              Algoritmos optimizados para pasar retos de Prop Firms (FTMO, FundedNext) y cuentas
              reales de inversión.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BOTS.map((bot) => {
              const Icon = bot.icon;
              return (
                <div
                  key={bot.name}
                  className={`glass-panel rounded-3xl p-6 border border-slate-800 transition-all flex flex-col justify-between group ${BOT_COLOR[bot.color]}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform ${BOT_COLOR[bot.color]}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] font-bold">
                        {bot.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white transition-colors">
                        {bot.name}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">{bot.desc}</p>
                    </div>

                    <div className="space-y-2 font-mono text-xs p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
                      {bot.stats.map(([label, value, color]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-slate-500">{label}</span>
                          <span className={`font-bold ${color}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        PRECIO LICENCIA
                      </span>
                      <span className="text-xl font-black text-white font-mono">{bot.price}</span>
                    </div>
                    <Link
                      to="/login"
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg"
                    >
                      Comprar / Detalle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INDICATORS */}
      <section id="section-indicators" className="py-20 border-t border-slate-800/80 bg-[#070a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                TradingView Scripts
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Indicadores VIP Invite-Only
              </h2>
              <p className="text-slate-400 text-sm">
                Visualiza bloques de órdenes institucionales (Order Blocks), imbalances (FVG) y
                señales de compra/venta directamente en tus gráficos de TradingView.
              </p>

              <div className="space-y-3 font-mono text-xs">
                {[
                  "Acceso instantáneo con tu usuario de TradingView",
                  "Actualizaciones constantes sin costo adicional",
                  "Compatible con cualquier par y temporalidad",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-panel-cyan rounded-3xl p-6 border border-cyan-500/30 cyan-glow flex items-center justify-center h-72">
                <div className="text-center space-y-2">
                  <LineChart className="w-14 h-14 text-cyan-400 mx-auto" />
                  <p className="text-slate-400 text-xs font-mono">
                    Vista previa de Order Blocks / FVG disponible dentro del portal de alumno
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section id="section-journal" className="py-20 border-t border-slate-800/80 bg-[#0b0f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Software para Estudiantes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Mr.Steval Trading Journal App
            </h2>
            <p className="text-slate-400 text-sm">
              La bitácora integrada que audita tu psicología, calcula ratios de riesgo/beneficio y
              analiza tus métricas día a día.
            </p>
          </div>

          <div className="glass-panel-cyan rounded-3xl p-8 border border-cyan-500/30 cyan-glow text-center">
            <p className="text-slate-300 text-sm font-mono max-w-xl mx-auto">
              Inicia sesión para llevar tu bitácora de operaciones, ver tu win-rate real y tus
              métricas de riesgo/beneficio en tu Portal de Alumno.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
            >
              <span>Entrar a mi Journal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="section-pricing" className="py-20 border-t border-slate-800/80 bg-[#070a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              Planes de Acceso
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Únete a Mr.Steval Academy
            </h2>
            <p className="text-slate-400 text-sm">
              Selecciona el nivel de acompañamiento algorítmico y educativo que necesitas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 space-y-6 relative ${
                  plan.highlight
                    ? "glass-panel-gold border border-amber-500/50 gold-glow"
                    : "glass-panel border border-slate-800 hover:border-slate-700 transition-all"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-amber-500 text-black font-mono font-extrabold text-[10px] uppercase shadow">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <span className={`text-xs font-mono uppercase font-bold ${plan.tagColor}`}>
                    {plan.tag}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1 font-mono">
                    <span
                      className={`text-4xl font-black ${plan.highlight ? "text-amber-400" : "text-white"}`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs font-mono text-slate-300">
                  {plan.features.map(([label, included]) => (
                    <li
                      key={label}
                      className={`flex items-center gap-2 ${!included ? "text-slate-500" : ""}`}
                    >
                      {included ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 shrink-0" />
                      )}
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/login"
                  className={`w-full block text-center py-3 rounded-xl font-bold text-xs transition-all ${
                    plan.highlight
                      ? "py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg gold-glow"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#0b0f17] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center font-bold text-black text-xs">
              MS
            </div>
            <span>© {new Date().getFullYear()} Mr.Steval Trading Academy</span>
          </div>
          <span className="text-[11px] text-slate-600 font-mono">
            El trading conlleva riesgo. Resultados pasados no garantizan resultados futuros.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
