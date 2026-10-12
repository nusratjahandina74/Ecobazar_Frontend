import { Minus, Plus } from "../common/Icons";

export default function QuantitySelector({ value, onIncrement, onDecrement, min = 1, max, disabled }) {
    return (
        <div className="flex items-center border rounded-lg border-forest/15 w-fit">
            <button
                type="button"
                onClick={onDecrement}
                disabled={disabled || value <= min}
                aria-label="Decrease quantity"
                className="flex items-center justify-center transition-colors w-9 h-9 text-forest/60 hover:text-leaf disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <Minus size={14} />
            </button>
            <span className="flex items-center justify-center w-10 text-sm font-medium" aria-live="polite">{value}</span>
            <button
                type="button"
                onClick={onIncrement}
                disabled={disabled || (max !== undefined && value >= max)}
                aria-label="Increase quantity"
                className="flex items-center justify-center transition-colors w-9 h-9 text-forest/60 hover:text-leaf disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}
