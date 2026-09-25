import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  ShieldCheck,
  Key,
  KeyRound,
  DollarSign,
  TrendingUp,
  Users,
  UserPlus,
  Cpu,
  CheckCircle,
  Clock,
  AlertCircle,
  Terminal,
  Search,
  Clipboard,
  RefreshCw,
  Settings,
  Plus,
  Trash2,
  X,
} from "lucide-react";

// Nombre del país en español a partir del código ISO que detecta el input (ej: "CO" -> "Colombia")
const getCountryName = (isoCode) => {
  if (!isoCode) return "";
  try {
    return new Intl.DisplayNames(["es"], { type: "region" }).of(isoCode);
  } catch {
    return isoCode;
  }
};

function LicenseGenerator() {
  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchParams] = useSearchParams();

  // Catálogos dinámicos (EAs y Planes de duración) — gestionables desde el Panel Admin
  const [eaCatalog, setEaCatalog] = useState([]);
  const [planCatalog, setPlanCatalog] = useState([]);
  const [showCatalogManager, setShowCatalogManager] = useState(false);
  const [newEaName, setNewEaName] = useState("");
  const [newPlanLabel, setNewPlanLabel] = useState("");
  const [newPlanDays, setNewPlanDays] = useState("");
  const [catalogError, setCatalogError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("CO");
  const [ea, setEa] = useState("");
  const [planId, setPlanId] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editDraft, setEditDraft] = useState({
    name: "",
    email: "",
    phone: "",
    planId: "",
    ea_name: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchLicenses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/licenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Error fetching licenses");
      }

      setLicenses(data);
      setFilteredLicenses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCatalogs = async () => {
    try {
      const [eaRes, planRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/catalog/eas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/catalog/plans`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const eaData = await eaRes.json();
      const planData = await planRes.json();

      if (eaRes.ok) {
        setEaCatalog(eaData);
        setEa((prev) => prev || eaData[0]?.name || "");
      }
      if (planRes.ok) {
        setPlanCatalog(planData);
        setPlanId((prev) => prev || String(planData[0]?.id || ""));
      }
    } catch {
      // silencioso: si falla, los selects quedan vacíos
    }
  };

  const addEA = async () => {
    if (!newEaName.trim()) return;
    setCatalogError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/catalog/eas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newEaName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo agregar el EA");

      setEaCatalog((prev) => [...prev, data.ea]);
      setNewEaName("");
    } catch (err) {
      setCatalogError(err.message);
    }
  };

  const removeEA = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/catalog/eas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setEaCatalog((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setCatalogError("No se pudo eliminar el EA");
    }
  };

  const addPlan = async () => {
    if (!newPlanLabel.trim()) return;
    setCatalogError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/catalog/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label: newPlanLabel,
          duration_days: newPlanDays === "" ? null : Number(newPlanDays),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo agregar el plan");

      setPlanCatalog((prev) => [...prev, data.plan]);
      setNewPlanLabel("");
      setNewPlanDays("");
    } catch (err) {
      setCatalogError(err.message);
    }
  };

  const removePlan = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/catalog/plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlanCatalog((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setCatalogError("No se pudo eliminar el plan");
    }
  };

  useEffect(() => {
    fetchLicenses();
    fetchCatalogs();
    const interval = setInterval(() => {
      fetchLicenses();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const paramName = searchParams.get("name");
    const paramEmail = searchParams.get("email");
    const paramPhone = searchParams.get("phone");
    const paramSearch = searchParams.get("search");

    if (paramName) setName(paramName);
    if (paramEmail) setEmail(paramEmail);
    if (paramPhone) setPhone(paramPhone);
    if (paramSearch) setSearch(paramSearch);
    // Solo se lee una vez al entrar a la página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = licenses.filter(
      (license) =>
        license.license_key.toLowerCase().includes(search.toLowerCase()) ||
        (license.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (license.email || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLicenses(filtered);
    setPage(1);
  }, [search, licenses]);

  const handleCreateLicense = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);

    try {
      const selectedPlan = planCatalog.find((p) => String(p.id) === String(planId));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/licenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          plan: selectedPlan?.label || "Vitalicia",
          duration_days: selectedPlan?.duration_days ?? null,
          ea_name: ea,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess(`Licencia generada para ${name} (${ea}).`);

      setName("");
      setEmail("");
      setPhone("");
      setEa(eaCatalog[0]?.name || "");
      setPlanId(String(planCatalog[0]?.id || ""));

      fetchLicenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const toggleStatus = async (license) => {
    const newStatus = license.status === "active" ? "inactive" : "active";

    await fetch(`${import.meta.env.VITE_API_URL}/licenses/${license.id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchLicenses();
  };

  const confirmDelete = (license) => {
    setLicenseToDelete(license);
    setShowDeleteModal(true);
  };

  const deleteLicense = async () => {
    if (!licenseToDelete) return;

    await fetch(`${import.meta.env.VITE_API_URL}/licenses/${licenseToDelete.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowDeleteModal(false);
    setLicenseToDelete(null);
    setSuccess("Licencia eliminada correctamente");
    setTimeout(() => setSuccess(""), 2000);

    await fetchLicenses();
  };

  const resetAccount = async (license) => {
    await fetch(`${import.meta.env.VITE_API_URL}/licenses/${license.id}/reset`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchLicenses();
    setShowResetAlert(true);
    setTimeout(() => setShowResetAlert(false), 2500);
  };

  const copyLicense = (key) => {
    navigator.clipboard.writeText(key);
    setSuccess("Copiado");
    setTimeout(() => setSuccess(""), 2000);
  };

  const saveEdits = async () => {
    if (!selectedLicense) return;
    setSavingEdit(true);
    setError("");
    try {
      const selectedPlan = planCatalog.find((p) => String(p.id) === String(editDraft.planId));

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/licenses/${selectedLicense.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editDraft.name,
            email: editDraft.email,
            phone: editDraft.phone,
            plan: selectedPlan?.label,
            duration_days: selectedPlan?.duration_days ?? null,
            ea_name: editDraft.ea_name,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo actualizar la licencia");

      setSelectedLicense((prev) =>
        prev
          ? {
              ...prev,
              name: editDraft.name,
              email: editDraft.email,
              phone: editDraft.phone,
              plan: selectedPlan?.label,
              duration_days: selectedPlan?.duration_days ?? null,
              ea_name: editDraft.ea_name,
              expires_at: data.license?.expires_at ?? prev.expires_at,
            }
          : prev
      );
      setSuccess("Licencia actualizada correctamente");
      setTimeout(() => setSuccess(""), 2500);
      fetchLicenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const getEAStatus = (lastSeen) => {
    if (!lastSeen) return "OFFLINE";
    const diffMinutes = (new Date() - new Date(lastSeen)) / 1000 / 60;
    return diffMinutes < 5 ? "ONLINE" : "OFFLINE";
  };

  const getExpiration = (date) => {
    if (!date) return "Vitalicia";
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Expirada";
    return `${diff} días`;
  };

  // Etiqueta con color para la columna "Expira", en el mismo estilo que el badge de "Activa"
  const getExpirationBadge = (date) => {
    const label = getExpiration(date);

    if (!date) {
      return { label, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    }
    if (label === "Expirada") {
      return { label, className: "bg-rose-500/20 text-rose-400 border-rose-500/30" };
    }

    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff <= 7) {
      return { label, className: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    }
    return { label, className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
  };

  // ==========================
  // KPIs reales derivados de las licencias
  // ==========================
  const total = licenses.length;
  const active = licenses.filter((l) => l.status === "active").length;
  const assigned = licenses.filter((l) => l.account_number).length;
  const online = licenses.filter((l) => getEAStatus(l.last_seen) === "ONLINE").length;
  const balanceTotal = licenses.reduce((acc, l) => acc + Number(l.balance || 0), 0);

  // Paginación de la tabla (máx. PAGE_SIZE filas por página)
  const totalPages = Math.max(1, Math.ceil(filteredLicenses.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedLicenses = filteredLicenses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ==========================
  // Audit log real, derivado de las licencias (ordenadas por creación)
  // ==========================
  const auditEntries = [...licenses]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8)
    .map((l) => ({
      id: l.id,
      text: `[LICENCIA] ${l.license_key} generada para ${l.name} (${l.email}).`,
      time: new Date(l.created_at).toLocaleString(),
      color:
        l.status === "active" ? "text-emerald-400" : "text-slate-300",
    }));

  return (
    <div className="space-y-8 font-sans">
      {showResetAlert && (
        <div className="fixed top-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
          Cuenta reseteada correctamente
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 glass-panel-rose rounded-3xl border border-rose-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Panel Administrador Master</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-[10px] font-bold uppercase tracking-wider">
                SuperAdmin Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Gestión centralizada de licencias, validación de cuentas MetaTrader y generación de EAs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(error || success) && (
            <p className={`text-xs font-mono ${error ? "text-rose-400" : "text-emerald-400"}`}>
              {error || success}
            </p>
          )}
          <button
            onClick={() => document.getElementById("adminStudentName")?.focus()}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 font-mono"
          >
            <Key className="w-4 h-4" />
            <span>Nueva Licencia</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid (reales) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>LICENCIAS TOTALES</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{total}</div>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Balance total ${balanceTotal.toFixed(2)}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>LICENCIAS ACTIVAS</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{active}</div>
          <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
            <UserPlus className="w-3 h-3" /> de {total} registradas
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>EA VINCULADOS (MT4/5)</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{assigned}</div>
          <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> cuentas MT asignadas
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>EA ONLINE AHORA</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{online}</div>
          <span className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> últimos 5 min
          </span>
        </div>
      </div>

      {/* License Generator & Table Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* EA Key Generator Form */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Generador de Licencias EA</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-500">MQL5 Direct Link</span>
          </div>

          <form onSubmit={handleCreateLicense} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">NOMBRE DEL ALUMNO / CLIENTE</label>
              <input
                type="text"
                id="adminStudentName"
                placeholder="Ej: Carlos Mendoza"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input p-3 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">CORREO ELECTRÓNICO</label>
              <input
                type="email"
                placeholder="carlos@correo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input p-3 rounded-xl text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400">ALGORITMO / EA SELECCIONADO</label>
                <button
                  type="button"
                  onClick={() => setShowCatalogManager(true)}
                  className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" /> Gestionar Catálogo
                </button>
              </div>
              <select
                value={ea}
                onChange={(e) => setEa(e.target.value)}
                className="w-full glass-input p-3 rounded-xl text-white"
              >
                {eaCatalog.length === 0 && <option value="">Sin EAs — agrega uno primero</option>}
                {eaCatalog.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">TELÉFONO (OPCIONAL)</label>
              <PhoneInput
                international
                defaultCountry="CO"
                value={phone}
                onChange={setPhone}
                onCountryChange={(c) => setPhoneCountry(c)}
                className="w-full"
              />
              {phoneCountry && (
                <p className="text-[10px] text-slate-500 mt-1">
                  País detectado: {getCountryName(phoneCountry)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">DURACIÓN</label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full glass-input p-3 rounded-xl text-white"
              >
                {planCatalog.length === 0 && <option value="">Sin planes — agrega uno primero</option>}
                {planCatalog.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              La cuenta MT4/MT5 se vincula automáticamente cuando el EA se
              conecta por primera vez con la licencia — no se asigna manualmente aquí.
            </p>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg rose-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Cpu className="w-4 h-4" />
              <span>{creating ? "GENERANDO..." : "Generar y Vincular Licencia"}</span>
            </button>
          </form>
        </div>

        {/* Active Student Table & Management */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Gestión de Licencias y Alumnos</span>
            </h2>
            <div className="hidden lg:block text-[10px] text-slate-500">
              Clic en una fila para gestionar
            </div>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar alumno o licencia..."
                className="w-full glass-input py-1.5 pl-8 pr-3 text-xs rounded-xl font-mono text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800/80">
                  <th className="py-2 font-normal">ALUMNO</th>
                  <th className="py-2 font-normal">LICENCIA</th>
                  <th className="py-2 font-normal">CUENTA MT</th>
                  <th className="py-2 font-normal">ESTADO</th>
                  <th className="py-2 font-normal">EXPIRA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {paginatedLicenses.map((license) => {
                  const expBadge = getExpirationBadge(license.expires_at);
                  return (
                    <tr
                      key={license.id}
                      onClick={() => {
                        setSelectedLicense(license);
                        const matchedPlan = planCatalog.find((p) => p.label === license.plan);
                        setEditDraft({
                          name: license.name || "",
                          email: license.email || "",
                          phone: license.phone || "",
                          phoneCountry: "CO",
                          planId: String(matchedPlan?.id || planCatalog[0]?.id || ""),
                          ea_name: license.ea_name || eaCatalog[0]?.name || "",
                        });
                        setShowProfileModal(true);
                      }}
                      className="hover:bg-slate-900/40 cursor-pointer"
                    >
                      <td className="py-3">
                        <div className="text-white font-semibold">{license.name}</div>
                        <div className="text-slate-500 text-[10px]">{license.email}</div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2 text-slate-300">
                          {license.license_key}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyLicense(license.license_key);
                            }}
                            className="text-slate-500 hover:text-white"
                          >
                            <Clipboard className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[10px]">
                          {getEAStatus(license.last_seen) === "ONLINE" ? (
                            <span className="text-emerald-400">● EA Online</span>
                          ) : (
                            <span className="text-slate-500">○ EA Offline</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-slate-300">
                        {license.account_number || "Sin asignar"}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] border ${
                            license.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {license.status === "active" ? "Activa" : "Revocada"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${expBadge.className}`}>
                          {expBadge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {paginatedLicenses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">
                      No hay licencias que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 font-mono text-xs">
              <span className="text-slate-500">
                Página {currentPage} de {totalPages} — {filteredLicenses.length} licencias
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
        </div>
      </div>

      {/* System Audit Log Section (real, derivado de licencias) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Registro de Actividad del Sistema (Audit Log)</span>
          </h2>
          <span className="text-slate-500 text-[10px]">Actualización en vivo</span>
        </div>

        <div className="space-y-2 text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-900 max-h-48 overflow-y-auto">
          {auditEntries.length === 0 && (
            <span className="text-slate-500">Sin actividad registrada todavía.</span>
          )}
          {auditEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-4">
              <span className={entry.color}>{entry.text}</span>
              <span className="text-[10px] text-slate-600 whitespace-nowrap">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL ELIMINAR */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="glass-panel p-8 rounded-3xl w-96 border border-rose-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-rose-400 font-bold mb-4">Confirmar eliminación</h2>
            <p className="text-slate-400 mb-6 text-sm">
              ¿Seguro que deseas eliminar la licencia de{" "}
              <span className="text-white">{licenseToDelete?.name}</span>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={deleteLicense}
                className="bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-xl font-semibold text-white"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERFIL / CENTRO DE CONTROL DE LA LICENCIA */}
      {showProfileModal && selectedLicense && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowProfileModal(false);
            setSelectedLicense(null);
          }}
        >
          <div
            className="glass-panel p-8 rounded-3xl w-full max-w-md border border-slate-800 text-xs font-mono space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="text-lg font-bold text-white">Editar Licencia</h2>
              <p className="text-slate-500">{selectedLicense.license_key}</p>
            </div>

            <div className="space-y-3 border-t border-slate-800 pt-4">
              <div>
                <label className="block text-slate-400 mb-1">NOMBRE DEL ALUMNO / CLIENTE</label>
                <input
                  type="text"
                  value={editDraft.name}
                  onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                  className="w-full glass-input p-2.5 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  value={editDraft.email}
                  onChange={(e) => setEditDraft((d) => ({ ...d, email: e.target.value }))}
                  className="w-full glass-input p-2.5 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">TELÉFONO</label>
                <PhoneInput
                  international
                  defaultCountry="CO"
                  value={editDraft.phone}
                  onChange={(val) => setEditDraft((d) => ({ ...d, phone: val || "" }))}
                  onCountryChange={(c) => setEditDraft((d) => ({ ...d, phoneCountry: c }))}
                  className="w-full"
                />
                {editDraft.phoneCountry && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    País detectado: {getCountryName(editDraft.phoneCountry)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ALGORITMO / EA</label>
                <select
                  value={editDraft.ea_name}
                  onChange={(e) => setEditDraft((d) => ({ ...d, ea_name: e.target.value }))}
                  className="w-full glass-input p-2.5 rounded-xl text-white"
                >
                  {eaCatalog.map((opt) => (
                    <option key={opt.id} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DURACIÓN</label>
                <select
                  value={editDraft.planId}
                  onChange={(e) => setEditDraft((d) => ({ ...d, planId: e.target.value }))}
                  className="w-full glass-input p-2.5 rounded-xl text-white"
                >
                  {planCatalog.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={saveEdits}
                disabled={savingEdit}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/40 disabled:opacity-50"
              >
                {savingEdit ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="flex justify-between text-slate-400">
                <span>Cuenta MT</span>
                <span className="text-slate-200">
                  {selectedLicense.account_number || "No vinculada"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estado</span>
                <span
                  className={
                    selectedLicense.status === "active" ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {selectedLicense.status === "active" ? "Activa" : "Revocada"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Expira</span>
                <span className="text-slate-200">{getExpiration(selectedLicense.expires_at)}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <button
                onClick={() => {
                  toggleStatus(selectedLicense);
                  setSelectedLicense((prev) =>
                    prev
                      ? { ...prev, status: prev.status === "active" ? "inactive" : "active" }
                      : prev
                  );
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs border ${
                  selectedLicense.status === "active"
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/40"
                }`}
              >
                {selectedLicense.status === "active" ? "Revocar Licencia" : "Activar Licencia"}
              </button>

              <button
                onClick={() => {
                  resetAccount(selectedLicense);
                  setSelectedLicense((prev) =>
                    prev ? { ...prev, account_number: null, last_seen: null } : prev
                  );
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/40"
              >
                Resetear Cuenta MT
              </button>

              <button
                onClick={() => {
                  setShowProfileModal(false);
                  confirmDelete(selectedLicense);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-rose-400 border border-slate-800 hover:bg-rose-500/20"
              >
                Eliminar Licencia
              </button>
            </div>

            <button
              onClick={() => {
                setShowProfileModal(false);
                setSelectedLicense(null);
              }}
              className="w-full text-center text-slate-500 hover:text-white pt-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL GESTIONAR CATÁLOGO (EAs y Planes) */}
      {showCatalogManager && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCatalogManager(false)}
        >
          <div
            className="glass-panel p-8 rounded-3xl w-full max-w-lg border border-cyan-500/30 space-y-6 font-mono text-xs max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Gestionar Catálogo</span>
              </h2>
              <button onClick={() => setShowCatalogManager(false)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {catalogError && <p className="text-rose-400">{catalogError}</p>}

            {/* EAs */}
            <div className="space-y-3">
              <h3 className="text-slate-300 font-bold">Algoritmos / EAs</h3>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {eaCatalog.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-white">{opt.name}</span>
                    <button onClick={() => removeEA(opt.id)} className="text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {eaCatalog.length === 0 && <p className="text-slate-500">Sin EAs todavía.</p>}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEaName}
                  onChange={(e) => setNewEaName(e.target.value)}
                  placeholder="Nombre del nuevo EA..."
                  className="flex-1 glass-input p-2.5 rounded-xl text-white"
                />
                <button
                  onClick={addEA}
                  className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/40 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
            </div>

            {/* Planes */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-slate-300 font-bold">Planes de Duración</h3>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {planCatalog.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-white">
                      {p.label}{" "}
                      <span className="text-slate-500">
                        ({p.duration_days ? `${p.duration_days} días` : "Vitalicia"})
                      </span>
                    </span>
                    <button onClick={() => removePlan(p.id)} className="text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {planCatalog.length === 0 && <p className="text-slate-500">Sin planes todavía.</p>}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newPlanLabel}
                  onChange={(e) => setNewPlanLabel(e.target.value)}
                  placeholder="Nombre (ej: 2 Días)"
                  className="col-span-2 glass-input p-2.5 rounded-xl text-white"
                />
                <input
                  type="number"
                  value={newPlanDays}
                  onChange={(e) => setNewPlanDays(e.target.value)}
                  placeholder="Días (vacío=Vitalicia)"
                  className="glass-input p-2.5 rounded-xl text-white"
                />
              </div>
              <button
                onClick={addPlan}
                className="w-full py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/40 font-bold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Plan
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              Eliminar un EA o Plan no afecta a las licencias que ya lo usan — solo deja de
              aparecer como opción para las nuevas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LicenseGenerator;
