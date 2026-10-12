import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, Package, AlertCircle, Loader2 } from "../../components/common/Icons";
import { getOrderByTransaction } from "../../api/orderApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { useCart } from "../../context/CartContext";
import { formatBDT } from "../../utils/adapters";

const MAX_POLLS = 6;

// Shows the status stored by the backend (set only by the verified gateway callback / IPN) —
// reaching this URL alone does NOT mean the payment succeeded.
export default function OrderSuccess() {
    const [params] = useSearchParams();
    const txnId = params.get("txnId");
    const { reload } = useCart();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const polls = useRef(0);

    useEffect(() => {
        if (!txnId) return;
        let active = true;
        let timer;

        const check = async () => {
            try {
                const o = await getOrderByTransaction(txnId);
                if (!active) return;
                setOrder(o);
                if (o.paymentStatus === "Pending" && polls.current < MAX_POLLS) {
                    polls.current += 1;
                    timer = setTimeout(check, 3000);
                    return;
                }
                if (o.paymentStatus === "Paid") reload(); // backend emptied the cart
            } catch (err) {
                if (active) setError(getErrorMessage(err));
            }
        };
        check();
        return () => { active = false; clearTimeout(timer); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txnId]);

    let view = "unknown";
    if (!txnId) view = "unknown";
    else if (error) view = "error";
    else if (order?.paymentStatus === "Paid") view = "paid";
    else if (order?.paymentStatus === "Pending") view = "pending";
    else if (order) view = "notpaid";
    else view = "checking";

    return (
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
            {view === "checking" && (
                <>
                    <Loader2 size={32} className="animate-spin text-leaf mx-auto" />
                    <p className="text-sm text-slate mt-4">Confirming your payment…</p>
                </>
            )}

            {view === "paid" && (
                <>
                    <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center mx-auto mb-6">
                        <Check size={28} className="text-leaf" strokeWidth={2.5} />
                    </div>
                    <h1 className="font-display text-3xl font-semibold text-forest">Payment confirmed</h1>
                    <p className="text-slate text-sm mt-2">Thank you! Your order is being processed.</p>

                    <div className="bg-white border border-forest/10 rounded-xl p-5 mt-8 flex items-center gap-4 text-left">
                        <div className="w-11 h-11 rounded-lg bg-leaf/10 flex items-center justify-center shrink-0">
                            <Package size={20} className="text-leaf" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-slate">Transaction ID</p>
                            <p className="text-sm font-semibold text-forest break-all">{order.transactionId}</p>
                            <p className="text-xs text-slate mt-1">Total paid: {formatBDT(order.totalAmount)}</p>
                        </div>
                    </div>
                </>
            )}

            {view === "pending" && (
                <>
                    <Loader2 size={32} className="text-leaf mx-auto" />
                    <h1 className="font-display text-2xl font-semibold text-forest mt-4">Payment not confirmed yet</h1>
                    <p className="text-slate text-sm mt-2">
                        The gateway has not confirmed this payment. If you were charged, it will appear in My Orders shortly.
                    </p>
                </>
            )}

            {view === "notpaid" && (
                <>
                    <AlertCircle size={32} className="text-red-500 mx-auto" />
                    <h1 className="font-display text-2xl font-semibold text-forest mt-4">This payment was not completed</h1>
                    <p className="text-slate text-sm mt-2">Status: {order.paymentStatus}. Your cart is still saved.</p>
                </>
            )}

            {view === "error" && (
                <>
                    <AlertCircle size={32} className="text-red-500 mx-auto" />
                    <h1 className="font-display text-2xl font-semibold text-forest mt-4">We couldn't verify your payment</h1>
                    <p role="alert" className="text-slate text-sm mt-2">{error}</p>
                </>
            )}

            {view === "unknown" && (
                <>
                    <h1 className="font-display text-2xl font-semibold text-forest">No order to show</h1>
                    <p className="text-slate text-sm mt-2">Open your orders to see their latest status.</p>
                </>
            )}

            {view !== "checking" && (
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link to="/my-orders" className="flex-1 py-2.5 rounded-lg bg-leaf text-white text-sm font-semibold hover:bg-leaf-dark transition-colors">
                        My Orders
                    </Link>
                    <Link to="/products" className="flex-1 py-2.5 rounded-lg border border-leaf/40 text-leaf-dark text-sm font-semibold hover:bg-leaf hover:text-white transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            )}
        </div>
    );
}
