import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Check, AlertCircle, X } from "./../components/common/Icons";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

    const push = useCallback((type, message) => {
        const id = ++idRef.current;
        setToasts((t) => [...t.slice(-3), { id, type, message }]);
        setTimeout(() => dismiss(id), 4500);
    }, [dismiss]);

    const api = useMemo(
        () => ({ success: (m) => push("success", m), error: (m) => push("error", m) }),
        [push]
    );

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm" aria-live="polite">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role={t.type === "error" ? "alert" : "status"}
                        className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-lg bg-white ${t.type === "error" ? "border-red-200 text-red-700" : "border-leaf/30 text-forest"
                            }`}
                    >
                        {t.type === "error" ? <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" /> : <Check size={18} className="text-leaf shrink-0 mt-0.5" />}
                        <span className="flex-1">{t.message}</span>
                        <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-forest/40 hover:text-forest"><X size={14} /></button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
