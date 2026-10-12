import { Outlet, NavLink, useNavigate } from "react-router";
import { User, Package, LogOut } from "../components/common/Icons";
import { useAuth } from "../context/AuthContext";

const links = [
    { to: "/profile", label: "Profile", icon: User },
    { to: "/my-orders", label: "My Orders", icon: Package },
];

export default function AccountLayout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-leaf text-white" : "text-forest/70 hover:bg-mint hover:text-leaf"
        }`;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                    <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                        {links.map(({ to, label, icon: Icon }) => (
                            <NavLink key={to} to={to} className={linkClass}>
                                <Icon size={17} />
                                {label}
                            </NavLink>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={17} />
                            Logout
                        </button>
                    </nav>
                </aside>

                <div className="lg:col-span-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};