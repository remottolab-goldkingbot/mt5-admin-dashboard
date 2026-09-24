import { useRef, useState } from "react";
import { ChevronDown, Plus, Wallet, Settings, Trash2 } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside";

function AccountSelector({ accounts, selectedId, onSelect, onAddNew, onEdit, onDelete, isPro }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => setOpen(false), open);
  const selected = accounts.find((a) => a.id === selectedId);

  if (!selected) return null;

  // Free: solo muestra el nombre de su única cuenta, sin selector ni botones
  if (!isPro) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 w-fit">
        <Wallet className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-bold text-white">{selected.name}</span>
        <span className="text-slate-500">
          ({selected.account_type === "fondeo" ? "Fondeo" : "Real"})
        </span>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative font-mono text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300"
      >
        <Wallet className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-bold text-white">{selected.name}</span>
        <span className="text-slate-500">
          ({selected.account_type === "fondeo" ? "Fondeo" : "Real"})
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-[200] mt-2 w-72 glass-panel-solid rounded-2xl p-2 space-y-1">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer ${
                acc.id === selectedId ? "bg-cyan-500/10 border border-cyan-500/30" : "hover:bg-slate-800/60"
              }`}
              onClick={() => {
                onSelect(acc.id);
                setOpen(false);
              }}
            >
              <div>
                <span className="text-white font-bold block">{acc.name}</span>
                <span className="text-slate-500">
                  {acc.account_type === "fondeo" ? "Fondeo" : "Real"} · ${Number(acc.initial_balance).toFixed(0)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(acc);
                    setOpen(false);
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-cyan-500/30 text-cyan-400"
                  title="Editar"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                {accounts.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(acc);
                      setOpen(false);
                    }}
                    className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/30 text-rose-400"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              onAddNew();
              setOpen(false);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold hover:bg-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Nueva Cuenta
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountSelector;
