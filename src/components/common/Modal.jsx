import { useEffect } from "react";
import { X } from "./Icons";

export default function Modal({ open, onClose, title, children, footer }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
            <div className="absolute inset-0 bg-forest/50" onClick={onClose} />
            <div className="relative flex flex-col bg-white rounded-xl w-full max-w-md shadow-xl max-h-[calc(100dvh-2rem)]">
                <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-forest/10 shrink-0">
                    <h3 className="font-display text-lg font-semibold text-forest">{title}</h3>
                    <button onClick={onClose} aria-label="Close" className="text-forest/40 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain">{children}</div>
                {footer && <div className="flex flex-wrap justify-end gap-3 p-4 sm:p-5 pt-2 sm:pt-2 shrink-0">{footer}</div>}
            </div>
        </div>
    );
}
