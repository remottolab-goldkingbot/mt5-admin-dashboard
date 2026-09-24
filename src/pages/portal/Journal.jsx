import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import JournalFree from "./JournalFree";
import JournalPro from "./JournalPro";
import JournalWelcomeModal from "./JournalWelcomeModal";
import AccountFormModal from "./AccountFormModal";
import { AlertTriangle } from "lucide-react";

function Journal() {
  const { user } = useAuth();
  const isPro = user?.membership === "pro";
  const token = localStorage.getItem("token");

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [formModal, setFormModal] = useState(null); // { mode, account } | null
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/journal/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAccounts(data);
        if (data.length > 0) {
          setSelectedId((prev) => prev || data[0].id);
        }
      }
    } catch {
      // silencioso
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (draft) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/journal/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "No se pudo crear la cuenta");

    setAccounts((prev) => [...prev, data.account]);
    setSelectedId(data.account.id);
    setFormModal(null);
  };

  const handleEditAccount = async (draft) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/journal/accounts/${draft.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "No se pudo actualizar la cuenta");

    setAccounts((prev) => prev.map((a) => (a.id === draft.id ? data.account : a)));
    setFormModal(null);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/journal/accounts/${accountToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo eliminar la cuenta");

      const remaining = accounts.filter((a) => a.id !== accountToDelete.id);
      setAccounts(remaining);
      if (selectedId === accountToDelete.id) {
        setSelectedId(remaining[0]?.id || null);
      }
      setAccountToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const selectedAccount = accounts.find((a) => a.id === selectedId) || null;

  if (loadingAccounts) {
    return <div className="text-slate-500 text-xs font-mono p-6">Cargando tu Journal...</div>;
  }

  // Primera vez: no tiene ninguna cuenta todavía -> configuración obligatoria
  if (accounts.length === 0) {
    return (
      <AccountFormModal
        mode="create"
        forceComplete
        onSave={handleCreateAccount}
        onClose={() => {}}
      />
    );
  }

  return (
    <>
      <JournalWelcomeModal />

      {error && <p className="text-rose-400 text-xs font-mono mb-4">{error}</p>}

      {selectedAccount && (isPro ? (
        <JournalPro
          account={selectedAccount}
          onAccountUpdated={fetchAccounts}
          accountSelectorProps={{
            accounts,
            selectedId,
            onSelect: setSelectedId,
            onAddNew: () => setFormModal({ mode: "create", account: null }),
            onEdit: (acc) => setFormModal({ mode: "edit", account: acc }),
            onDelete: (acc) => setAccountToDelete(acc),
            isPro,
          }}
        />
      ) : (
        <JournalFree
          account={selectedAccount}
          accountSelectorProps={{
            accounts,
            selectedId,
            onSelect: setSelectedId,
            onAddNew: () => setFormModal({ mode: "create", account: null }),
            onEdit: (acc) => setFormModal({ mode: "edit", account: acc }),
            onDelete: (acc) => setAccountToDelete(acc),
            isPro,
          }}
        />
      ))}

      {formModal && (
        <AccountFormModal
          mode={formModal.mode}
          account={formModal.account}
          onSave={formModal.mode === "create" ? handleCreateAccount : handleEditAccount}
          onClose={() => setFormModal(null)}
        />
      )}

      {accountToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="glass-panel p-8 rounded-3xl w-full max-w-sm border border-rose-500/30 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h2 className="text-white font-bold text-lg">¿Eliminar esta cuenta?</h2>
            <p className="text-slate-400 text-xs font-mono">
              <span className="text-white">{accountToDelete.name}</span> y{" "}
              <strong>todos sus trades registrados</strong> se van a eliminar permanentemente.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setAccountToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Journal;
