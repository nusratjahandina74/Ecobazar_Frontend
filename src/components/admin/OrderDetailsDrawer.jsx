import { X, MapPin, Phone, Mail } from "../common/Icons";
import OrderStatusBadge from "../common/OrderStatusBadge";

const statusOptions = ["processing", "shipped", "delivered", "cancelled"];

export default function OrderDetailsDrawer({ order, onClose, onStatusChange }) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-paper overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-ink/10 bg-white sticky top-0">
                    <div>
                        <p className="text-xs text-slate">Order</p>
                        <h2 className="font-display text-lg font-semibold text-ink">{order._id}</h2>
                    </div>
                    <button onClick={onClose} className="text-ink/40 hover:text-ink transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-5">
                    {/* Status control */}
                    <div className="bg-white rounded-xl border border-ink/10 p-4">
                        <p className="text-xs text-slate mb-2">Order Status</p>
                        <div className="flex items-center justify-between gap-3">
                            <OrderStatusBadge status={order.status} />
                            <select
                                value={order.status}
                                onChange={(e) => onStatusChange(order._id, e.target.value)}
                                className="text-sm border border-ink/15 rounded-lg px-3 py-1.5 bg-white capitalize
                  focus:outline-none focus:ring-2 focus:ring-amber/20"
                            >
                                {statusOptions.map((s) => (
                                    <option key={s} value={s} className="capitalize">{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Customer info */}
                    <div className="bg-white rounded-xl border border-ink/10 p-4">
                        <p className="text-xs text-slate mb-3">Customer</p>
                        <p className="text-sm font-semibold text-ink mb-2">{order.customer.name}</p>
                        <div className="flex flex-col gap-2 text-sm text-slate">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-ink/40 shrink-0" />
                                {order.customer.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-ink/40 shrink-0" />
                                {order.customer.phone}
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-ink/40 shrink-0 mt-0.5" />
                                {order.address}
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white rounded-xl border border-ink/10 p-4">
                        <p className="text-xs text-slate mb-3">Items ({order.items.length})</p>
                        <div className="flex flex-col gap-3">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-ink/5 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-ink font-medium line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-slate">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-ink">৳{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment summary */}
                    <div className="bg-white rounded-xl border border-ink/10 p-4">
                        <div className="flex justify-between text-sm text-slate mb-1.5">
                            <span>Payment method</span>
                            <span className="text-ink font-medium">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate mb-1.5">
                            <span>Order date</span>
                            <span className="text-ink font-medium">
                                {new Date(order.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-ink/10">
                            <span className="text-sm font-semibold text-ink">Total</span>
                            <span className="font-display text-xl font-semibold text-ink">৳{order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};