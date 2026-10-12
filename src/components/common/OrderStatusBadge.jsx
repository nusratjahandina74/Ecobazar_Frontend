import { Check, Truck, Clock, X, Package } from "./Icons";

// Keys are the backend's real values: orderStatus (Order Placed | Processing | Shipped | Delivered | Cancelled)
const statusConfig = {
    "Order Placed": { label: "Order Placed", color: "text-slate bg-forest/5", icon: Package },
    Processing: { label: "Processing", color: "text-leaf-dark bg-leaf/10", icon: Clock },
    Shipped: { label: "Shipped", color: "text-blue-700 bg-blue-50", icon: Truck },
    Delivered: { label: "Delivered", color: "text-white bg-leaf", icon: Check },
    Cancelled: { label: "Cancelled", color: "text-red-600 bg-red-50", icon: X },
};

export default function OrderStatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig["Order Placed"];
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${config.color}`}>
            <Icon size={12} />
            {config.label}
        </span>
    );
}

const payColors = {
    Paid: "text-leaf-dark bg-leaf/10",
    Pending: "text-yellow-700 bg-yellow-50",
    Failed: "text-red-600 bg-red-50",
    Cancelled: "text-red-600 bg-red-50",
};

export function PaymentStatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${payColors[status] || "text-slate bg-forest/5"}`}>
            {status || "—"}
        </span>
    );
}
