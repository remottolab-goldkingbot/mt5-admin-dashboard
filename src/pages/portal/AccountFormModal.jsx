import { useState } from "react";
import { Settings, X } from "lucide-react";

/**
 * mode: "create" | "edit"
 * account: cuenta actual (para editar) o null (para crear)
 * onSave: (payload) => Promise
 * onClose: () => void  (si mode === "create" y es la primera cuenta, no se debe poder cerrar sin guardar)
 * forceComplete: true cuando es la primera cuenta obligatoria (oculta el boton de cerrar)
 */
function AccountFormModal({ mode = "create", account, onSave, onClose, forceComplete = false }) {
  const [draft, setDraft] = useState(
    account || {
      name: "Cuenta Principal",
      account_type: "real",
      initial_balance: 0,
      profit_target: "",
      daily_limit: "",
      max_limit: "",
      has_personal_goals: false,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(draft);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 font-sans"
      onClick={forceComplete ? undefined : onClose}
    >
      <div
        className="glass-panel p-8 rounded-3xl w-full max-w-md border border-cyan-500/30 space-y-5 font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-white font-bold text-base flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>
              {forceComplete
                ? "Configura tu primera cuenta"
                : mode === "create"
                ? "Nueva Cuenta"
                : "Editar Cuenta"}
            </span>
          </h2>
          {!forceComplete && (
            <button onClick={onClose} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {forceComplete && (
          <p className="text-slate-400 text-[11px]">
            Antes de empezar a registrar operaciones, dinos qué tipo de cuenta vas a llevar aquí.
            Puedes cambiarlo o agregar más cuentas después.
          </p>
        )}

        {error && <p className="text-rose-400">{error}</p>}

        <div>
          <label className="block text-slate-400 mb-1.5">NOMBRE DE LA CUENTA</label>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="Ej: FTMO 10K, Mi cuenta real..."
            className="w-full glass-input p-2.5 rounded-xl text-white"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1.5">TIPO DE CUENTA</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDraft((d) => ({ ...d, account_type: "fondeo" }))}
              className={`py-2.5 rounded-xl font-bold transition-all ${
                draft.account_type === "fondeo"
                  ? "bg-amber-500 text-black"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              Fondeo (Prop Firm)
            </button>
            <button
              type="button"
              onClick={() => setDraft((d) => ({ ...d, account_type: "real" }))}
              className={`py-2.5 rounded-xl font-bold transition-all ${
                draft.account_type === "real"
                  ? "bg-cyan-500 text-black"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              Real / Propia
            </button>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 mb-1.5">SALDO INICIAL ($)</label>
          <input
            type="number"
            value={draft.initial_balance || 0}
            onChange={(e) => setDraft((d) => ({ ...d, initial_balance: e.target.value }))}
            className="w-full glass-input p-2.5 rounded-xl text-white"
          />
        </div>

        {draft.account_type === "real" && (
          <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(draft.has_personal_goals)}
              onChange={(e) => setDraft((d) => ({ ...d, has_personal_goals: e.target.checked }))}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500"
            />
            <span className="text-slate-300">Definir mis propias metas de disciplina</span>
          </label>
        )}

        {(draft.account_type === "fondeo" || draft.has_personal_goals) && (
          <div className="space-y-3 pt-1 border-t border-slate-800">
            <div>
              <label className="block text-slate-400 mb-1.5">
                {draft.account_type === "fondeo" ? "OBJETIVO DE BENEFICIO ($)" : "MI META PERSONAL ($)"}
              </label>
              <input
                type="number"
                value={draft.profit_target || ""}
                onChange={(e) => setDraft((d) => ({ ...d, profit_target: e.target.value }))}
                placeholder="Ej: 1000"
                className="w-full glass-input p-2.5 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">REDUCCIÓN DIARIA MÁXIMA ($)</label>
              <input
                type="number"
                value={draft.daily_limit || ""}
                onChange={(e) => setDraft((d) => ({ ...d, daily_limit: e.target.value }))}
                placeholder="Ej: 200"
                className="w-full glass-input p-2.5 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">REDUCCIÓN MÁXIMA TOTAL ($)</label>
              <input
                type="number"
                value={draft.max_limit || ""}
                onChange={(e) => setDraft((d) => ({ ...d, max_limit: e.target.value }))}
                placeholder="Ej: 500"
                className="w-full glass-input p-2.5 rounded-xl text-white"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold disabled:opacity-50"
        >
          {saving ? "Guardando..." : forceComplete ? "Crear mi cuenta y empezar" : "Guardar"}
        </button>
      </div>
    </div>
  );
}

export default AccountFormModal;
