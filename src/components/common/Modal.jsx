import { useEffect } from "react";
import { X } from "./Icons";

export default function Modal({ open, onClose, title, children, footer }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
            <div className="absolute inset-0 bg-forest/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between p-5 border-b border-forest/10">
                    <h3 className="font-display text-lg font-semibold text-forest">{title}</h3>
                    <button onClick={onClose} aria-label="Close" className="text-forest/40 hover:text-leaf transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5">{children}</div>
                {footer && <div className="flex justify-end gap-3 p-5 pt-0">{footer}</div>}
            </div>
        </div>
    );
}
