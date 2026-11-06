import { Eye } from "../common/Icons";
import OrderStatusBadge from "../common/OrderStatusBadge";

export default function OrderTable({ orders, onViewClick }) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl border border-ink/10">
                <p className="text-slate text-sm">No orders found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-ink/10 text-left text-xs text-slate uppercase tracking-wide">
                            <th className="px-5 py-3 font-medium">Order</th>
                            <th className="px-5 py-3 font-medium">Customer</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-5 py-3 font-medium">Total</th>
                            <th className="px-5 py-3 font-medium">Payment</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                                <td className="px-5 py-3 font-medium text-ink">{order._id}</td>
                                <td className="px-5 py-3">
                                    <p className="text-ink">{order.customer.name}</p>
                                    <p className="text-xs text-slate">{order.customer.email}</p>
                                </td>
                                <td className="px-5 py-3 text-slate">
                                    {new Date(order.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                </td>
                                <td className="px-5 py-3 text-ink font-medium">৳{order.total.toLocaleString()}</td>
                                <td className="px-5 py-3 text-slate">{order.paymentMethod}</td>
                                <td className="px-5 py-3"><OrderStatusBadge status={order.status} /></td>
                                <td className="px-5 py-3 text-right">
                                    <button
                                        onClick={() => onViewClick(order)}
                                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-ink/50 hover:bg-ink/5 hover:text-ink transition-colors"
                                    >
                                        <Eye size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};