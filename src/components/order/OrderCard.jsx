import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown } from "../common/Icons";
import OrderStatusBadge, { PaymentStatusBadge } from "../common/OrderStatusBadge";
import { formatBDT, formatDate } from "../../utils/adapters";

export default function OrderCard({ order }) {
    const [expanded, setExpanded] = useState(false);
    const a = order.shippingAddress;

    return (
        <div className="bg-white rounded-xl border border-forest/10 overflow-hidden transition-colors">
            <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left">
                <div className="flex items-center gap-x-5 sm:gap-x-6 gap-y-3 flex-wrap min-w-0">
                    <div>
                        <p className="text-xs text-slate">Order</p>
                        <p className="text-sm font-semibold text-forest">{order.orderNumber || order.transactionId}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate">Placed on</p>
                        <p className="text-sm text-forest">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate">Total</p>
                        <p className="text-sm font-semibold text-forest">{formatBDT(order.totalAmount)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <OrderStatusBadge status={order.orderStatus} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                </div>
                <ChevronDown size={18} className={`text-forest/40 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>

            {expanded && (
                <div className="border-t border-forest/10 p-4 sm:p-5">
                    <div className="flex flex-col gap-3">
                        {order.items.map((item, i) => (
                            <div key={`${item.productId}-${i}`} className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <Link to={`/products/${item.productId}`} className="text-sm text-forest font-medium line-clamp-1">{item.title}</Link>
                                    <p className="text-xs text-slate">{item.variantLabel ? `${item.variantLabel} · ` : ""}Qty: {item.quantity} × {formatBDT(item.price)}</p>
                                </div>
                                <span className="text-sm font-semibold text-forest shrink-0">{formatBDT(item.totalPrice)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-forest/10 text-xs text-slate space-y-1">
                        <p className="[overflow-wrap:anywhere]">Items {formatBDT(order.subtotal)} + delivery {formatBDT(order.deliveryCharge)} ({order.deliveryZone === "outside_dhaka" ? "outside Dhaka" : "inside Dhaka"}) · {order.paymentMethod === "cod" ? "Cash on delivery" : "Paid online"}</p>
                        {order.courier?.trackingCode && <p>Courier tracking: <span className="font-semibold text-forest">{order.courier.trackingCode}</span></p>}
                    </div>
                    <p className="text-xs text-slate mt-3 [overflow-wrap:anywhere]">
                        Ship to: {[a.name, a.address1, a.address2 !== "N/A" && a.address2, a.city, a.postcode].filter(Boolean).join(", ")}
                    </p>
                </div>
            )}
        </div>
    );
}
