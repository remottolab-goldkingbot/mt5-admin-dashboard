import { DollarSign, GraduationCap, Bot, PlayCircle, Activity } from "lucide-react";

function Overview() {
  return (
    <div className="space-y-6 font-sans">
      <div className="glass-panel-rose p-6 rounded-3xl border border-rose-500/30">
        <h1 className="text-2xl font-bold text-white">Visión General SaaS</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Resumen ejecutivo del ecosistema Mr.Steval Trading Academy
        </p>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>REVENUE MENSUAL (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">$18,420 USD</div>
          <span className="text-[11px] text-emerald-400 font-mono">+22% este mes</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ALUMNOS ACTIVOS</span>
            <GraduationCap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">1,428</div>
          <span className="text-[11px] text-amber-400 font-mono">88% Membresías Pro</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>EAS/BOTS ACTIVOS</span>
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">942 Cuentas</div>
          <span className="text-[11px] text-cyan-400 font-mono">Ejecutando en MT4/MT5</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>REPRODUCCIONES CURSO</span>
            <PlayCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">14,290 hrs</div>
          <span className="text-[11px] text-rose-400 font-mono">94% Tasa finalización</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          <span>Estado General de Plataforma Mr.Steval</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-slate-400 block">Software más popular:</span>
            <p className="text-amber-400 font-bold text-sm">Gold Cascade Pro v4.2</p>
            <p className="text-slate-500 text-[10px]">620 Cuentas MetaTrader vinculadas</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-slate-400 block">Curso más visto:</span>
            <p className="text-cyan-400 font-bold text-sm">Mastering Smart Money & EAs</p>
            <p className="text-slate-500 text-[10px]">18 Módulos HD • 42 Videos</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-slate-400 block">Indicador TradingView Top:</span>
            <p className="text-emerald-400 font-bold text-sm">Institutional Liquidity Levels</p>
            <p className="text-slate-500 text-[10px]">Acceso otorgado a 1,120 usuarios</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Estos números son de referencia visual — cuando conectemos reportes reales de ventas y
        academia, se reemplazan por datos en vivo.
      </p>
    </div>
  );
}

export default Overview;
