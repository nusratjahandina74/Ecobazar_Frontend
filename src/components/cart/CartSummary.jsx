import { Link } from "react-router";
import { ShieldCheck } from "../common/Icons";
import { formatBDT } from "../../utils/adapters";

export default function CartSummary({ subtotal, itemCount, disabled }) {
    return (
        <div className="sticky p-5 bg-white border rounded-xl border-forest/10 top-24">
            <h3 className="mb-4 text-lg font-semibold font-display text-forest">Order Summary</h3>

            <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-slate">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                    <span className="font-medium text-forest">{formatBDT(subtotal)}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-forest/10">
                <span className="text-sm font-semibold text-forest">Total</span>
                <span className="text-2xl font-semibold font-display text-forest">{formatBDT(subtotal)}</span>
            </div>
            <p className="text-xs text-slate mt-1.5">The final payable amount is confirmed by the server at checkout.</p>

            <Link
                to="/checkout"
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : undefined}
                className={`block text-center w-full py-3 rounded-lg text-sm font-semibold mt-5 transition-all ${disabled
                    ? "bg-forest/10 text-forest/30 pointer-events-none"
                    : "bg-leaf text-white hover:bg-leaf-dark hover:shadow-md hover:shadow-leaf/30"}`}
            >
                Proceed to Checkout
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate mt-4">
                <ShieldCheck size={14} /> Secure checkout
            </div>
        </div>
    );
}
