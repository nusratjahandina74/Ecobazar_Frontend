import { formatBDT } from "../../utils/adapters";

export default function OrderSummary({ items = [], subtotal = 0, deliveryCharge = 0, deliveryFree = false, discount = 0, couponCode = "", children }) {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return (
        <div className="p-5 bg-white border shadow-sm rounded-xl border-forest/10">
            <h3 className="mb-4 text-lg font-semibold font-display text-forest">
                Your Order ({count} {count === 1 ? "item" : "items"})
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm max-h-60 overflow-y-auto pr-1">
                {items.map((i) => (
                    <li key={i.cartId} className="flex justify-between gap-3 text-slate">
                        <span className="line-clamp-1 min-w-0 [overflow-wrap:anywhere]">{i.title}{i.variantLabel ? ` (${i.variantLabel})` : ""} <span className="text-slate/60">× {i.quantity}</span></span>
                        <span className="font-medium text-forest shrink-0">{formatBDT(i.price * i.quantity)}</span>
                    </li>
                ))}
            </ul>
            {children && <div className="pt-4 mt-4 border-t border-forest/10">{children}</div>}
            <dl className="pt-4 mt-4 space-y-2 text-sm border-t border-forest/10">
                <div className="flex justify-between text-slate"><dt>Subtotal</dt><dd className="font-medium text-forest">{formatBDT(subtotal)}</dd></div>
                {discount > 0 && <div className="flex justify-between text-leaf-dark"><dt>Coupon {couponCode}</dt><dd className="font-medium">-{formatBDT(discount)}</dd></div>}
                <div className="flex justify-between text-slate"><dt>Delivery charge</dt><dd className="font-medium text-forest">{deliveryFree ? "Free" : formatBDT(deliveryCharge)}</dd></div>
            </dl>
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-forest/10">
                <span className="text-sm font-semibold text-forest">Total</span>
                <span className="text-2xl font-semibold font-display text-forest">{formatBDT(subtotal - discount + deliveryCharge)}</span>
            </div>
            <p className="text-xs text-slate mt-1.5">The server re-checks prices and delivery charge when you place the order.</p>
        </div>
    );
}
