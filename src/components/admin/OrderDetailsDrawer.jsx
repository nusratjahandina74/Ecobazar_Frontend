import { useEffect } from "react";
import { X, MapPin, Phone, Mail } from "../common/Icons";
import OrderStatusBadge, { PaymentStatusBadge } from "../common/OrderStatusBadge";
import { ORDER_STATUSES } from "../../utils/constants";
import { formatBDT, formatDate } from "../../utils/adapters";

export default function OrderDetailsDrawer({ order, onClose, onStatusChange, updating }) {
    useEffect(() => {
        if (!order) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [order, onClose]);

    if (!order) return null;
    const a = order.shippingAddress;

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Order details">
            <div className="absolute inset-0 bg-forest/50" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-forest/10 bg-white sticky top-0">
                    <div className="min-w-0">
                        <p className="text-xs text-slate">Order</p>
                        <h2 className="font-display text-base font-semibold text-forest break-all">{order.transactionId}</h2>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="text-forest/40 hover:text-leaf transition-colors"><X size={20} /></button>
                </div>

                <div className="p-5 flex flex-col gap-5 bg-mint/40">
                    <div className="bg-white rounded-xl border border-forest/10 p-4">
                        <p className="text-xs text-slate mb-2">Order status</p>
                        <div className="flex items-center justify-between gap-3">
                            <OrderStatusBadge status={order.orderStatus} />
                            <select
                                value={order.orderStatus}
                                disabled={updating}
                                onChange={(e) => onStatusChange(order._id, e.target.value)}
                                aria-label="Change order status"
                                className="text-sm border border-forest/15 rounded-lg px-3 py-1.5 bg-white hover:border-leaf/50 focus:outline-none focus:ring-2 focus:ring-leaf/20 disabled:opacity-60"
                            >
                                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-forest/10 p-4">
                        <p className="text-xs text-slate mb-3">Customer & shipping</p>
                        <p className="text-sm font-semibold text-forest mb-2">{a.name}</p>
                        <div className="flex flex-col gap-2 text-sm text-slate">
                            <div className="flex items-center gap-2"><Mail size={14} className="text-leaf shrink-0" />{a.email}</div>
                            <div className="flex items-center gap-2"><Phone size={14} className="text-leaf shrink-0" />{a.phone}</div>
                            <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-leaf shrink-0 mt-0.5" />
                                {[a.address1, a.address2 !== "N/A" && a.address2, a.city, a.state !== "N/A" && a.state, a.postcode].filter(Boolean).join(", ")}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-forest/10 p-4">
                        <p className="text-xs text-slate mb-3">Items ({order.items.length})</p>
                        <div className="flex flex-col gap-3">
                            {order.items.map((item, i) => (
                                <div key={`${item.productId}-${i}`} className="flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-forest font-medium line-clamp-1">{item.title}</p>
                                        <p className="text-xs text-slate">SKU {item.sku || "—"} · Qty {item.quantity} × {formatBDT(item.price)}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-forest">{formatBDT(item.totalPrice)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-forest/10 p-4">
                        <div className="flex justify-between items-center text-sm text-slate mb-1.5"><span>Payment</span><PaymentStatusBadge status={order.paymentStatus} /></div>
                        <div className="flex justify-between text-sm text-slate mb-1.5"><span>Order date</span><span className="text-forest font-medium">{formatDate(order.createdAt)}</span></div>
                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-forest/10">
                            <span className="text-sm font-semibold text-forest">Total</span>
                            <span className="font-display text-xl font-semibold text-forest">{formatBDT(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
