import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import {
    LayoutDashboard, Package, Users, ShoppingBag, LogOut, Menu, X,
} from "../components/common/Icons";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-amber text-ink" : "text-paper/70 hover:bg-paper/10 hover:text-paper"
        }`;

    return (
        <div className="min-h-screen bg-paper flex">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:flex flex-col w-60 bg-ink shrink-0">
                <Link to="/admin" className="font-display text-xl font-semibold text-paper px-5 h-16 flex items-center border-b border-paper/10">
                    Eco<span className="text-amber">Bazaar</span>
                    <span className="text-xs font-sans font-normal text-paper/40 ml-2">Admin</span>
                </Link>

                <nav className="flex-1 flex flex-col gap-1 p-4">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end} className={linkClass}>
                            <Icon size={17} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-paper/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-ink/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-60 bg-ink flex flex-col">
                        <div className="flex items-center justify-between px-5 h-16 border-b border-paper/10">
                            <Link to="/admin" className="font-display text-xl font-semibold text-paper">
                                Eco<span className="text-amber">Bazaar</span>
                            </Link>
                            <button onClick={() => setSidebarOpen(false)}>
                                <X size={20} className="text-paper/60" />
                            </button>
                        </div>
                        <nav className="flex-1 flex flex-col gap-1 p-4">
                            {navItems.map(({ to, label, icon: Icon, end }) => (
                                <NavLink key={to} to={to} end={end} className={linkClass} onClick={() => setSidebarOpen(false)}>
                                    <Icon size={17} />
                                    {label}
                                </NavLink>
                            ))}
                        </nav>
                        <div className="p-4 border-t border-paper/10">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full"
                            >
                                <LogOut size={17} />
                                Logout
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden h-16 bg-white border-b border-ink/10 flex items-center px-4 justify-between">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu size={22} className="text-ink" />
                    </button>
                    <span className="font-display text-lg font-semibold text-ink">
                        Eco<span className="text-amber">Bazaar</span> Admin
                    </span>
                    <div className="w-6" />
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};