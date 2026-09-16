function Academy() {
  return (
    <div className="space-y-6 font-sans">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">Academia Quant & Formación Institucional</h2>
        <p className="text-xs text-slate-400">Módulos educativos interactivos.</p>
      </div>

      <div className="glass-panel-gold rounded-2xl p-6 border border-amber-500/40 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Módulo 2: Programación & Configuración de EAs
          </h3>
          <span className="text-amber-400 font-bold">68% COMPLETADO</span>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span className="text-white">2.1 Configuración de VPS y MT5 24/7 Execution</span>
            <button className="px-3 py-1 rounded bg-slate-800 text-slate-200">Ver Clase</button>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/40 flex justify-between items-center">
            <span className="text-amber-300 font-bold">
              2.2 Optimización de Backtesting Tick Data 99%
            </span>
            <button className="px-3 py-1 rounded bg-amber-500 text-black font-bold">Ver Ahora</button>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * El progreso de módulos es de ejemplo — se conecta a datos reales cuando integremos el
        video-CMS con el backend.
      </p>
    </div>
  );
}

export default Academy;
