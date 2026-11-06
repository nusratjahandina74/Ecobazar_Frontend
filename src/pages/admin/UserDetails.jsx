import { useParams, Link } from "react-router";
import { Mail, Phone, User as UserIcon, Package } from "../../components/common/Icons";
import { mockUser } from "../../utils/mockUsers";
import { mockOrders } from "../../utils/mockOrders";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";

export default function UserDetails() {
    const { id } = useParams();

    // TODO: replace with data fetched from GET /getsingleuser/:id
    const user = mockUser.find((u) => u._id === id);

    if (!user) {
        return (
            <div className="text-center py-16">
                <p className="text-slate">User not found.</p>
                <Link to="/admin/users" className="text-amber font-medium hover:underline mt-2 inline-block">
                    Back to users
                </Link>
            </div>
        );
    }

    const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    // TODO: filter real orders by user id once order data is user-linked
    const userOrders = mockOrders.slice(0, 2);

    return (
        <div>
            <Link to="/admin/users" className="text-sm text-slate hover:text-ink transition-colors">
                ← Back to Users
            </Link>

            <div className="flex items-center gap-4 mt-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-ink text-paper flex items-center justify-center font-display text-xl font-semibold shrink-0">
                    {initials}
                </div>
                <div>
                    <h1 className="font-display text-2xl font-semibold text-ink">{user.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${user.role === "admin" ? "text-amber bg-amber/10" : "text-slate bg-ink/5"}`}>
                            {user.role}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${user.status === "active" ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}>
                            {user.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white rounded-xl border border-ink/10 p-5">
                    <h2 className="font-display text-lg font-semibold text-ink mb-4">Contact Info</h2>
                    <div className="flex flex-col gap-3 text-sm">
                        <div className="flex items-center gap-3 text-slate">
                            <Mail size={16} className="text-ink/40 shrink-0" />
                            {user.email}
                        </div>
                        <div className="flex items-center gap-3 text-slate">
                            <Phone size={16} className="text-ink/40 shrink-0" />
                            {user.phone}
                        </div>
                        <div className="flex items-center gap-3 text-slate">
                            <UserIcon size={16} className="text-ink/40 shrink-0" />
                            Joined {new Date(user.joined).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl border border-ink/10 p-5">
                    <h2 className="font-display text-lg font-semibold text-ink mb-4">Order History</h2>
                    {userOrders.length === 0 ? (
                        <div className="text-center py-8">
                            <Package size={24} className="text-ink/20 mx-auto mb-2" />
                            <p className="text-sm text-slate">No orders yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {userOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-3 rounded-lg bg-ink/[0.02]">
                                    <div>
                                        <p className="text-sm font-medium text-ink">{order._id}</p>
                                        <p className="text-xs text-slate">
                                            {new Date(order.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-ink">৳{order.total.toLocaleString()}</span>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};