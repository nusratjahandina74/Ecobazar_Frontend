import { useState } from "react";
import { useParams, Link } from "react-router";
import { Mail, Phone, User as UserIcon } from "../../components/common/Icons";
import OrderStatusBadge, { PaymentStatusBadge } from "../../components/common/OrderStatusBadge";
import { RoleBadge, HoldBadge } from "../../components/admin/UserTable";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateViews";
import useFetch from "../../hooks/useFetch";
import { getUser, updateUser } from "../../api/userApi";
import { getAllOrders } from "../../api/orderApi";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";
import { formatBDT, formatDate } from "../../utils/adapters";

export default function UserDetails() {
    const { id } = useParams();
    const toast = useToast();
    const { user: me } = useAuth();
    const { data, loading, error, reload } = useFetch(async () => {
        const [user, orders] = await Promise.all([getUser(id), getAllOrders().catch(() => null)]);
        return { user, orders: orders ? orders.filter((o) => o.customer?._id === id) : null };
    }, [id]);
    const [saving, setSaving] = useState(false);

    if (loading) return <PageLoader />;
    if (error || !data) {
        return (
            <div>
                <ErrorState message={error || "User not found."} onRetry={reload} />
                <p className="text-center"><Link to="/admin/users" className="font-medium text-leaf hover:underline">Back to users</Link></p>
            </div>
        );
    }
    const { user, orders } = data;
    const isSelf = me._id === user._id;

    const changeRole = async (role) => {
        setSaving(true);
        try { await updateUser(user._id, { role }); toast.success("Role updated"); reload(); }
        catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    return (
        <div>
            <Link to="/admin/users" className="text-sm transition-colors text-slate hover:text-leaf">← Back to Users</Link>

            <div className="mt-4 mb-8">
                <h1 className="text-2xl font-semibold font-display text-forest">{user.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <RoleBadge role={user.role} />
                    <HoldBadge isHold={user.isHold} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="p-5 bg-white border lg:col-span-1 rounded-xl border-forest/10">
                    <h2 className="mb-4 text-lg font-semibold font-display text-forest">Contact Info</h2>
                    <div className="flex flex-col gap-3 text-sm">
                        <div className="flex items-center gap-3 text-slate"><Mail size={16} className="text-leaf shrink-0" />{user.email} <span className="text-xs">({user.isVerified ? "verified" : "unverified"})</span></div>
                        <div className="flex items-center gap-3 text-slate"><Phone size={16} className="text-leaf shrink-0" />{user.phoneNumber || "—"}</div>
                        <div className="flex items-center gap-3 text-slate"><UserIcon size={16} className="text-leaf shrink-0" />Joined {formatDate(user.createdAt)}</div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-forest/10">
                        <label htmlFor="role" className="text-sm font-medium text-forest block mb-1.5">Role</label>
                        <select id="role" value={user.role} disabled={saving || isSelf} onChange={(e) => changeRole(e.target.value)}
                            className="w-full py-2.5 px-3 rounded-lg border border-forest/15 bg-white text-sm capitalize hover:border-leaf/50 focus:outline-none focus:ring-4 focus:ring-leaf/15 focus:border-leaf disabled:opacity-60">
                            {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {isSelf && <p className="text-xs text-slate mt-1">You can't change your own role.</p>}
                    </div>
                </div>

                <div className="p-5 bg-white border lg:col-span-2 rounded-xl border-forest/10">
                    <h2 className="mb-4 text-lg font-semibold font-display text-forest">Order History</h2>
                    {orders === null ? (
                        <p className="text-sm text-slate">Orders could not be loaded.</p>
                    ) : orders.length === 0 ? (
                        <p className="text-sm text-slate">This user has no orders yet.</p>
                    ) : (
                        <div className="flex flex-col divide-y divide-forest/10">
                            {orders.map((o) => (
                                <div key={o._id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-forest">{o.transactionId}</p>
                                        <p className="text-xs text-slate">{formatDate(o.createdAt)} · {o.items.length} item(s)</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <OrderStatusBadge status={o.orderStatus} />
                                        <PaymentStatusBadge status={o.paymentStatus} />
                                        <span className="text-sm font-semibold text-forest">{formatBDT(o.totalAmount)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
