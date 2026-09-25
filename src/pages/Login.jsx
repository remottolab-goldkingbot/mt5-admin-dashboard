import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Cpu,
  LineChart,
  BookOpen,
  ShieldCheck,
  Server,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

function Login() {
  const { login } = useAuth();
  const { showToast, dismissToast } = useToast();
  const navigate = useNavigate();

  // Tab visual (login / register / forgot).
  const [tab, setTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const redirectByRole = (role) => {
    navigate(role === "admin" ? "/panel" : "/portal");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loadingId = showToast("Autenticando credenciales en servidor MT5...", "loading", 0);

    try {
      const loggedUser = await login(email, password);
      dismissToast(loadingId);

      const firstName = (loggedUser?.name || loggedUser?.email || "").split(" ")[0];
      showToast(`¡Inicio de sesión exitoso! Bienvenido ${firstName}.`, "success");

      setTimeout(() => {
        showToast(
          loggedUser?.role === "admin"
            ? "Sesión Activa: Panel de Administrador"
            : "Sesión Activa: Portal de Alumno (Dashboard)",
          "info"
        );
      }, 350);

      redirectByRole(loggedUser?.role);
    } catch (err) {
      dismissToast(loadingId);
      showToast(err.message || "Credenciales inválidas", "error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");

    if (regPassword !== regConfirm) {
      setRegError("Las contraseñas no coinciden");
      return;
    }

    setRegLoading(true);
    const loadingId = showToast("Creando tu cuenta en el sistema...", "loading", 0);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, phone: regPhone, password: regPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo crear la cuenta");

      dismissToast(loadingId);
      showToast("Cuenta creada. Iniciando sesión...", "success");

      // Auto-login tras registrarse
      const loggedUser = await login(regEmail, regPassword);

      setTimeout(() => {
        showToast(
          loggedUser?.role === "admin"
            ? "Sesión Activa: Panel de Administrador"
            : "Sesión Activa: Portal de Alumno (Dashboard)",
          "info"
        );
      }, 350);

      redirectByRole(loggedUser?.role);
    } catch (err) {
      dismissToast(loadingId);
      showToast(err.message || "No se pudo crear la cuenta", "error");
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  const showComingSoon = (label) => {
    setNotice(`${label}: disponible próximamente.`);
    setTimeout(() => setNotice(""), 2500);
  };

  return (
    <div className="min-h-screen flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 auth-bg bg-brand-dark font-sans">
      <div className="max-w-4xl w-full grid md:grid-cols-12 glass-panel-gold rounded-3xl overflow-hidden border border-amber-500/40 gold-glow shadow-2xl">
        {/* Panel izquierdo — info institucional */}
        <div className="md:col-span-5 p-8 bg-[#0b0f17]/90 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center font-bold text-black font-mono text-xl shadow-lg shadow-amber-500/20">
                MS
              </div>
              <div>
                <span className="text-lg font-extrabold text-white block leading-none">
                  Mr.Steval
                </span>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                  Trading Portal Access
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white leading-tight mb-3">
              Acceso a la Suite <br />
              <span className="text-gradient-gold">Algorítmica VIP</span>
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Ingresa a tu cuenta para gestionar licencias de Robots EAs,
              activar scripts invite-only en TradingView y registrar tu
              bitácora diaria.
            </p>

            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Ejecución VPS 24/7 de EAs</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <LineChart className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Indicadores Institucionales</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Trading Journal con Analítica</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-2 text-[10px] font-mono text-slate-500">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> SSL 256-Bit Encrypted
              </span>
              <span className="text-slate-400">v5.0 Secure</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" /> MT4/MT5
                Direct Sync
              </span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="md:col-span-7 p-6 sm:p-8 bg-[#070a0f]/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono mb-6">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`flex-1 py-2 rounded-lg font-bold transition-all text-center ${
                  tab === "login"
                    ? "bg-amber-500 text-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setTab("register")}
                className={`flex-1 py-2 rounded-lg font-bold transition-all text-center ${
                  tab === "register"
                    ? "bg-amber-500 text-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Crear Cuenta
              </button>
              <button
                type="button"
                onClick={() => setTab("forgot")}
                className={`flex-1 py-2 rounded-lg font-bold transition-all text-center ${
                  tab === "forgot"
                    ? "bg-amber-500 text-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Recuperar
              </button>
            </div>

            {notice && (
              <p className="text-amber-400 text-xs font-mono mb-4">{notice}</p>
            )}

            {tab === "login" && (
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  {error && (
                    <p className="text-rose-500 text-xs">{error}</p>
                  )}

                  <div>
                    <label className="block text-slate-400 mb-1">
                      CORREO ELECTRÓNICO O USUARIO MT5
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="alumno@mrsteval.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-3 py-3 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-400">CONTRASEÑA</label>
                      <button
                        type="button"
                        onClick={() => setTab("forgot")}
                        className="text-amber-400 text-[10px] hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-9 py-3 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Recordar este equipo</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <span>{loading ? "VERIFICANDO..." : "ACCEDER AL PORTAL VIP"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-800 space-y-3 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 block text-center uppercase tracking-wider">
                    O INGRESA RÁPIDAMENTE CON
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => showComingSoon("TradingView OAuth")}
                      className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <LineChart className="w-4 h-4 text-cyan-400" />
                      <span>TradingView</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showComingSoon("MetaTrader 5 Connect")}
                      className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>MetaTrader 5</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4 font-mono text-xs">
                {regError && <p className="text-rose-500 text-xs">{regError}</p>}

                <div>
                  <label className="block text-slate-400 mb-1">NOMBRE COMPLETO</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full glass-input rounded-xl pl-9 pr-3 py-3 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">CORREO ELECTRÓNICO</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="alumno@mrsteval.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-3 py-3 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">TELÉFONO</label>
                    <PhoneInput
                      international
                      defaultCountry="CO"
                      value={regPhone}
                      onChange={(val) => setRegPhone(val || "")}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">CONTRASEÑA</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-9 py-3 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">CONFIRMAR</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showRegConfirm ? "text" : "password"}
                        required
                        minLength={6}
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-9 py-3 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500">
                  Las cuentas nuevas se crean con acceso de alumno (Portal). Los accesos de
                  administrador se otorgan manualmente en la base de datos.
                </p>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>{regLoading ? "CREANDO CUENTA..." : "CREAR MI CUENTA"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {tab === "forgot" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 text-center">
                  La recuperación de contraseña estará disponible próximamente.
                  Contacta a un administrador si necesitas reestablecer tu acceso.
                </div>
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold"
                >
                  Volver a Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
