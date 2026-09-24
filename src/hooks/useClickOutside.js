import { useEffect } from "react";

/**
 * Cierra un elemento (dropdown, panel, etc.) cuando se hace clic fuera de él.
 * Uso: const ref = useRef(null); useClickOutside(ref, () => setOpen(false), open);
 */
export default function useClickOutside(ref, onOutsideClick, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onOutsideClick, enabled]);
}
