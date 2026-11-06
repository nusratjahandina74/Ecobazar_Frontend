import { Star } from "./Icons";

/** Read-only star rating. `value` 0-5 (halves rounded to the nearest star). */
export function Stars({ value = 0, size = 14, className = "" }) {
    const v = Math.round(Number(value) || 0);
    return (
        <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} className={i <= v ? "fill-amber-400 text-amber-400" : "text-forest/20"} />)}
        </span>
    );
}

/** Stars + count, hidden when there are no reviews yet. */
export function RatingBadge({ value, count, size = 13 }) {
    if (!count) return null;
    return <span className="inline-flex items-center gap-1 text-xs text-slate"><Stars value={value} size={size} /><span>{Number(value).toFixed(1)} ({count})</span></span>;
}

/** Clickable star picker for the review form. */
export function StarPicker({ value, onChange }) {
    return (
        <div role="radiogroup" aria-label="Your rating" className="inline-flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={`${i} star${i > 1 ? "s" : ""}`} onClick={() => onChange(i)} className="p-0.5">
                    <Star size={26} className={i <= value ? "fill-amber-400 text-amber-400" : "text-forest/25"} />
                </button>
            ))}
        </div>
    );
}
