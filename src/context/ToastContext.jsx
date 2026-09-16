import { createContext, useContext, useState, useCallback, useRef } from "react";
import { Loader2, CheckCircle2, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext();

const STYLES = {
  loading: {
    border: "border-amber-500/40",
    text: "text-amber-400",
    icon: Loader2,
    spin: true,
  },
  success: {
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    icon: CheckCircle2,
    spin: false,
  },
  info: {
    border: "border-cyan-500/40",
    text: "text-cyan-400",
    icon: Info,
    spin: false,
  },
  error: {
    border: "border-rose-500/40",
    text: "text-rose-400",
    icon: AlertTriangle,
    spin: false,
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, type = "info", duration = 3200) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      <div className="fixed bottom-5 right-5 z-[100] space-y-2 font-mono text-xs pointer-events-none">
        {toasts.map((t) => {
          const style = STYLES[t.type] || STYLES.info;
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              className={`glass-panel px-4 py-3 rounded-xl border ${style.border} shadow-2xl flex items-center gap-2.5 max-w-sm toast-in`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${style.text} ${style.spin ? "animate-spin" : ""}`} />
              <span className={style.text}>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
