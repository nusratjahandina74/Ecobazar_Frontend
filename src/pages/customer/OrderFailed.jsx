import { Link, useSearchParams } from "react-router";
import { AlertCircle } from "../../components/common/Icons";

const REASONS = {
    cancelled: "You cancelled the payment.",
    failed: "The payment gateway reported that the payment failed.",
    unverified: "We could not verify this payment with the gateway.",
    not_found: "We couldn't find that order.",
    server_error: "A server error occurred while processing the payment.",
};

export default function OrderFailed() {
    const [params] = useSearchParams();
    const reason = REASONS[params.get("reason")] || "Something went wrong processing your payment.";
    const txnId = params.get("txnId");

    return (
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={28} className="text-red-500" strokeWidth={2.5} />
            </div>

            <h1 className="font-display text-3xl font-semibold text-forest">Payment not completed</h1>
            <p className="text-slate text-sm mt-2">{reason} Your cart items are still saved — nothing was lost.</p>
            {txnId && <p className="text-xs text-slate/70 mt-3 break-all">Reference: {txnId}</p>}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link to="/checkout" className="flex-1 py-2.5 rounded-lg bg-leaf text-white text-sm font-semibold hover:bg-leaf-dark transition-colors">Try Again</Link>
                <Link to="/cart" className="flex-1 py-2.5 rounded-lg border border-leaf/40 text-leaf-dark text-sm font-semibold hover:bg-leaf hover:text-white transition-colors">Back to Cart</Link>
            </div>
        </div>
    );
}
