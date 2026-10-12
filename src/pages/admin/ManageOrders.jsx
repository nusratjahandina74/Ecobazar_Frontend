import { useState, useMemo, useEffect } from "react";
import { Search, Package, Clock, Truck, Check } from "../../components/common/Icons";
import OrderTable from "../../components/admin/OrderTable";
import OrderDetailsDrawer from "../../components/admin/OrderDetailsDrawer";
import Pagination from "../../components/common/Pagination";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateViews";
import useFetch from "../../hooks/useFetch";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import { useToast } from "../../context/ToastContext";
import { ORDER_STATUSES } from "../../utils/constants";
import { formatBDT } from "../../utils/adapters";

const statusFilters = ["all", ...ORDER_STATUSES];
const PER_PAGE = 10;

export default function ManageOrders() {
    const toast = useToast();
    const { data, loading, error, reload, setData } = useFetch(() => getAllOrders(), []);
    const orders = useMemo(() => data || [], [data]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [updating, setUpdating] = useState(false);

    const selectedOrder = orders.find((o) => o._id === selectedId) || null;

    const stats = useMemo(() => {
        const paid = orders.filter((o) => o.paymentStatus === "Paid");
        return [
            { label: "Total Orders", value: orders.length, icon: Package },
            { label: "Processing", value: orders.filter((o) => o.orderStatus === "Processing").length, icon: Clock },
            { label: "Shipped", value: orders.filter((o) => o.orderStatus === "Shipped").length, icon: Truck },
            { label: "Paid revenue", value: formatBDT(paid.reduce((s, o) => s + o.totalAmount, 0)), icon: Check },
        ];
    }, [orders]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return orders.filter((o) =>
            (o.transactionId.toLowerCase().includes(q) || (o.shippingAddress.name || "").toLowerCase().includes(q) || (o.customer?.email || "").toLowerCase().includes(q)) &&
            (statusFilter === "all" || o.orderStatus === statusFilter));
    }, [orders, search, statusFilter]);

    useEffect(() => setPage(1), [search, statusFilter]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            const updated = await updateOrderStatus(orderId, newStatus);
            // keep the populated customer from the list response
            setData((prev) => prev.map((o) => (o._id === orderId ? { ...o, orderStatus: updated.orderStatus } : o)));
            toast.success("Order status updated");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-display text-2xl font-semibold text-forest">Orders</h1>
                <p className="text-sm text-slate mt-1">Manage and track customer orders.</p>
            </div>

            {loading ? <PageLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {stats.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="bg-white rounded-xl border border-forest/10 p-4 flex items-center gap-3 hover:border-leaf/40 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-leaf/10 flex items-center justify-center shrink-0"><Icon size={18} className="text-leaf" /></div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate">{label}</p>
                                    <p className="font-display text-lg font-semibold text-forest truncate">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap mb-5">
                        <div className="relative flex-1 max-w-sm">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                            <input
                                type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by transaction, name or email..." aria-label="Search orders"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-forest/15 bg-white text-sm hover:border-leaf/50 focus:outline-none focus:ring-4 focus:ring-leaf/15 focus:border-leaf transition-all"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {statusFilters.map((s) => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === s ? "bg-leaf text-white" : "bg-white border border-forest/15 text-forest/70 hover:border-leaf hover:text-leaf"}`}>
                                    {s === "all" ? "All" : s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <OrderTable orders={pageItems} onViewClick={(o) => setSelectedId(o._id)} />
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            <OrderDetailsDrawer order={selectedOrder} onClose={() => setSelectedId(null)} onStatusChange={handleStatusChange} updating={updating} />
        </div>
    );
}
