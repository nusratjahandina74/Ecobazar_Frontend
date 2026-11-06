import { useState, useMemo } from "react";
import { Search, Package, Clock, Truck, Check } from "../../components/common/Icons";
import OrderTable from "../../components/admin/OrderTable";
import OrderDetailsDrawer from "../../components/admin/OrderDetailsDrawer";
import { mockOrders } from "../../utils/mockOrders";

const statusFilters = ["all", "processing", "shipped", "delivered", "cancelled"];

export default function ManageOrders() {
    // TODO: replace with data fetched from GET /get-all-orders (needs to be added to backend)
    const [orders, setOrders] = useState(mockOrders);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const stats = useMemo(() => {
        const revenue = orders
            .filter((o) => o.status !== "cancelled")
            .reduce((sum, o) => sum + o.total, 0);
        const pending = orders.filter((o) => o.status === "processing").length;
        const shipped = orders.filter((o) => o.status === "shipped").length;
        return [
            { label: "Total Orders", value: orders.length, icon: Package },
            { label: "Processing", value: pending, icon: Clock },
            { label: "Shipped", value: shipped, icon: Truck },
            { label: "Revenue", value: `৳${revenue.toLocaleString()}`, icon: Check },
        ];
    }, [orders]);

    const filtered = useMemo(() => {
        return orders.filter((o) => {
            const matchesSearch =
                o._id.toLowerCase().includes(search.toLowerCase()) ||
                o.customer.name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || o.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    const handleStatusChange = (orderId, newStatus) => {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
        setSelectedOrder((prev) => (prev && prev._id === orderId ? { ...prev, status: newStatus } : prev));
        // TODO: connect to PATCH /update-order-status/:id (needs to be added to backend)
        console.log("Update order status:", orderId, newStatus);
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-display text-2xl font-semibold text-ink">Orders</h1>
                <p className="text-sm text-slate mt-1">Manage and track customer orders.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white rounded-xl border border-ink/10 p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-amber" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-slate">{label}</p>
                            <p className="font-display text-lg font-semibold text-ink truncate">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by order ID or customer..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink/15 bg-white text-sm
              focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto">
                    {statusFilters.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${statusFilter === s ? "bg-ink text-paper" : "bg-white border border-ink/15 text-ink/60 hover:bg-ink/5"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <OrderTable orders={filtered} onViewClick={setSelectedOrder} />

            <OrderDetailsDrawer
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};