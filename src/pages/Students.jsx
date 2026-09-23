import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, KeyRound, ShieldCheck, Trash2, AlertTriangle } from "lucide-react";

const PAGE_SIZE = 10;

function Students() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudieron cargar los alumnos");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => {
      fetchUsers();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToGenerator = (u) => {
    navigate(
      `/panel/licencias/generar?name=${encodeURIComponent(u.name || "")}&email=${encodeURIComponent(u.email || "")}&phone=${encodeURIComponent(u.phone || "")}`
    );
  };

  const goToLicenses = (u) => {
    navigate(`/panel/licencias/generar?search=${encodeURIComponent(u.email || "")}`);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo eliminar el usuario");

      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const toggleMembership = async (u) => {
    const newMembership = u.membership === "pro" ? "free" : "pro";
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/users/${u.id}/membership`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ membership: newMembership }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo actualizar la membresía");
      fetchUsers();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Base de Datos de Alumnos Registrados</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Todas las cuentas registradas — con o sin licencia asignada todavía.
            </p>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Filtrar por correo o nombre..."
              className="glass-input pl-8 pr-3 py-1.5 rounded-xl text-white text-xs w-64"
            />
          </div>
        </div>

        {loading && <p className="text-slate-500">Cargando alumnos...</p>}
        {error && <p className="text-rose-400">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="py-2">USUARIO</th>
                    <th className="py-2">CORREO</th>
                    <th className="py-2">ROL</th>
                    <th className="py-2">PLAN</th>
                    <th className="py-2">LICENCIAS</th>
                    <th className="py-2">REGISTRADO</th>
                    <th className="py-2 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {paginated.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 text-white font-bold flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {(u.name || u.email || "?").slice(0, 2).toUpperCase()}
                        </div>
                        {u.name || "(Sin nombre)"}
                      </td>
                      <td className="py-3 text-slate-300">{u.email}</td>
                      <td className="py-3">
                        {u.role === "admin" ? (
                          <span className="px-2 py-0.5 rounded border text-[10px] bg-rose-500/20 text-rose-400 border-rose-500/30 flex items-center gap-1 w-fit">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded border text-[10px] bg-slate-800 text-slate-300 border-slate-700">
                            Alumno
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {u.role === "admin" ? (
                          <span className="text-slate-600">—</span>
                        ) : (
                          <button
                            onClick={() => toggleMembership(u)}
                            title="Clic para cambiar de plan"
                            className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                              u.membership === "pro"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/40"
                                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                            }`}
                          >
                            {u.membership === "pro" ? "★ PRO" : "Free"}
                          </button>
                        )}
                      </td>
                      <td className="py-3">
                        {Number(u.license_count) > 0 ? (
                          <span className="px-2 py-0.5 rounded border text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            {u.license_count} licencia{u.license_count > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded border text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">
                            Sin licencia
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-400">
                        {new Date(u.created_at).toLocaleDateString("es-CO")}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          {Number(u.license_count) > 0 ? (
                            <button
                              onClick={() => goToLicenses(u)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                            >
                              Ver Licencias
                            </button>
                          ) : (
                            <button
                              onClick={() => goToGenerator(u)}
                              className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 border border-amber-500/30 rounded flex items-center gap-1"
                            >
                              <KeyRound className="w-3 h-3" />
                              Generar Licencia
                            </button>
                          )}

                          {u.role !== "admin" && (
                            <button
                              onClick={() => {
                                setUserToDelete(u);
                                setDeleteError("");
                              }}
                              title="Eliminar cuenta"
                              className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/30 text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500">
                        Sin resultados{search ? ` para "${search}"` : ""}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-500">
                  Página {currentPage} de {totalPages} — {filtered.length} alumnos
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <p className="text-[10px] text-slate-500 font-mono text-center">
        * Esta tabla ya es 100% real — viene de tu base de datos, no es de ejemplo.
      </p>

      {userToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-8 rounded-3xl w-full max-w-sm border border-rose-500/30 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h2 className="text-white font-bold text-lg">¿Eliminar esta cuenta?</h2>
            <p className="text-slate-400 text-xs font-mono">
              Vas a eliminar permanentemente la cuenta de{" "}
              <span className="text-white">{userToDelete.name || userToDelete.email}</span>. Esta
              acción no se puede deshacer.
            </p>

            {deleteError && <p className="text-rose-400 text-xs font-mono">{deleteError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={confirmDeleteUser}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
