import { Package, Users, ShoppingBag, CreditCard } from "../../components/common/Icons";
import { PageLoader } from "../../components/common/Loader";
import useFetch from "../../hooks/useFetch";
import { getProducts } from "../../api/productApi";
import { getUsers } from "../../api/userApi";
import { getAllOrders } from "../../api/orderApi";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";
import { formatBDT } from "../../utils/adapters";

function Stat({ label, value, icon: Icon, hint }) {
    return (
        <div className="bg-white rounded-xl border border-forest/10 p-5 flex items-center gap-4 hover:border-leaf/40 hover:shadow-md hover:shadow-leaf/10 transition-all">
            <div className="w-11 h-11 rounded-lg bg-leaf/10 flex items-center justify-center shrink-0"><Icon size={20} className="text-leaf" /></div>
            <div>
                <p className="text-xs text-slate">{label}</p>
                <p className="font-display text-2xl font-semibold text-forest">{value}</p>
                {hint && <p className="text-xs text-slate/70">{hint}</p>}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const isAdmin = user.role === ROLES.ADMIN;

    const { data, loading } = useFetch(async (signal) => {
        const [products, users, orders] = await Promise.allSettled([
            getProducts({ signal }),
            isAdmin ? getUsers() : Promise.reject(new Error("admin only")),
            isAdmin ? getAllOrders() : Promise.reject(new Error("admin only")),
        ]);
        return {
            products: products.status === "fulfilled" ? products.value : null,
            users: users.status === "fulfilled" ? users.value : null,
            orders: orders.status === "fulfilled" ? orders.value : null,
        };
    }, [isAdmin]);

    if (loading) return <PageLoader />;
    const { products, users, orders } = data;
    const dash = "—";
    const paid = orders?.filter((o) => o.paymentStatus === "Paid") || [];

    return (
        <div>
            <h1 className="font-display text-2xl font-semibold text-forest mb-1">Dashboard</h1>
            <p className="text-sm text-slate mb-6">Overview of your store.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Stat label="Total products" icon={Package} value={products ? products.length : dash}
                    hint={products ? `${products.filter((p) => p.status === "active").length} active · ${products.filter((p) => p.stock === 0).length} out of stock` : undefined} />
                {isAdmin && <Stat label="Total users" icon={Users} value={users ? users.length : dash} />}
                {isAdmin && <Stat label="Total orders" icon={ShoppingBag} value={orders ? orders.length : dash} hint={orders ? `${paid.length} paid` : undefined} />}
                {isAdmin && <Stat label="Paid revenue" icon={CreditCard} value={orders ? formatBDT(paid.reduce((s, o) => s + o.totalAmount, 0)) : dash} />}
            </div>
        </div>
    );
}
