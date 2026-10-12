import { Eye } from "../common/Icons";
import OrderStatusBadge, { PaymentStatusBadge } from "../common/OrderStatusBadge";
import { formatBDT, formatDate } from "../../utils/adapters";

export default function OrderTable({ orders, onViewClick }) {
    if (orders.length === 0) {
        return <div className="text-center py-16 bg-white rounded-xl border border-forest/10"><p className="text-slate text-sm">No orders found.</p></div>;
    }

    return (
        <div className="bg-white rounded-xl border border-forest/10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-forest/10 text-left text-xs text-slate uppercase tracking-wide bg-mint/60">
                            <th className="px-5 py-3 font-medium">Transaction</th>
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
                            <tr key={order._id} className="border-b border-forest/5 last:border-0 hover:bg-mint/50 transition-colors">
                                <td className="px-5 py-3 font-medium text-forest whitespace-nowrap">{order.transactionId}</td>
                                <td className="px-5 py-3">
                                    <p className="text-forest">{order.shippingAddress.name || order.customer?.name}</p>
                                    <p className="text-xs text-slate">{order.customer?.email || order.shippingAddress.email}</p>
                                </td>
                                <td className="px-5 py-3 text-slate whitespace-nowrap">{formatDate(order.createdAt)}</td>
                                <td className="px-5 py-3 text-forest font-medium">{formatBDT(order.totalAmount)}</td>
                                <td className="px-5 py-3"><PaymentStatusBadge status={order.paymentStatus} /></td>
                                <td className="px-5 py-3"><OrderStatusBadge status={order.orderStatus} /></td>
                                <td className="px-5 py-3 text-right">
                                    <button onClick={() => onViewClick(order)} aria-label={`View order ${order.transactionId}`}
                                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-forest/50 hover:bg-leaf/10 hover:text-leaf transition-colors">
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
}
