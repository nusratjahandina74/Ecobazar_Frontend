import { formatBDT } from "../../utils/adapters";

export default function OrderSummary({ items = [], subtotal = 0 }) {
    const count = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <div className="sticky p-5 bg-white border rounded-xl border-forest/10 top-24">
            <h3 className="mb-4 text-lg font-semibold font-display text-forest">
                Your Order ({count} {count === 1 ? "item" : "items"})
            </h3>

            <ul className="flex flex-col gap-2.5 text-sm max-h-60 overflow-y-auto pr-1">
                {items.map((i) => (
                    <li key={i.cartId} className="flex justify-between gap-3 text-slate">
                        <span className="line-clamp-1">{i.title} <span className="text-slate/60">× {i.quantity}</span></span>
                        <span className="font-medium text-forest shrink-0">{formatBDT(i.price * i.quantity)}</span>
                    </li>
                ))}
            </ul>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-forest/10">
                <span className="text-sm font-semibold text-forest">Total</span>
                <span className="text-2xl font-semibold font-display text-forest">{formatBDT(subtotal)}</span>
            </div>
            <p className="text-xs text-slate mt-1.5">The server recalculates the amount from current prices when you pay.</p>
        </div>
    );
}
