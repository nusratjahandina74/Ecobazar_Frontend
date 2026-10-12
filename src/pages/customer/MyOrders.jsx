import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Package } from "../../components/common/Icons";
import OrderCard from "../../components/order/OrderCard";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateViews";
import useFetch from "../../hooks/useFetch";
import { getMyOrders } from "../../api/orderApi";

const filters = ["all", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function MyOrders() {
    const [filter, setFilter] = useState("all");
    const { data, loading, error, reload } = useFetch(() => getMyOrders(), []);
    const orders = useMemo(() => data || [], [data]);
    const filtered = useMemo(() => (filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter)), [orders, filter]);

    return (
        <div>
            <h1 className="font-display text-2xl font-semibold text-forest mb-1">My Orders</h1>
            <p className="text-sm text-slate mb-6">Track your orders and their payment status.</p>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors capitalize ${filter === f ? "bg-leaf text-white" : "bg-mint text-forest/70 hover:bg-leaf/20"}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? <PageLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-forest/10">
                    <div className="w-14 h-14 rounded-full bg-mint flex items-center justify-center mx-auto mb-4">
                        <Package size={22} className="text-leaf" />
                    </div>
                    <p className="text-slate text-sm">No {filter !== "all" ? filter.toLowerCase() : ""} orders found.</p>
                    <Link to="/products" className="text-leaf text-sm font-medium hover:underline mt-2 inline-block">Start shopping</Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map((order) => <OrderCard key={order._id} order={order} />)}
                </div>
            )}
        </div>
    );
}
