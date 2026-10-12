import { AlertCircle } from "./Icons";

export function ErrorState({ message, onRetry }) {
    return (
        <div role="alert" className="text-center py-16 px-4">
            <AlertCircle size={32} className="mx-auto text-red-500" />
            <p className="mt-3 text-sm font-medium text-forest">{message || "Something went wrong."}</p>
            {onRetry && (
                <button onClick={onRetry} className="mt-4 px-4 py-2 rounded-lg border border-leaf text-leaf text-sm font-semibold hover:bg-leaf hover:text-white transition-colors">
                    Try again
                </button>
            )}
        </div>
    );
}

export function EmptyState({ title, text, action }) {
    return (
        <div className="text-center py-16 px-4">
            <p className="font-display text-xl font-semibold text-forest">{title}</p>
            {text && <p className="text-sm text-slate mt-1.5">{text}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
