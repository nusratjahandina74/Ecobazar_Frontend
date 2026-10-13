import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation, useSearchParams } from "react-router";
import { ShoppingCart, User, Menu, X, Search, ChevronDown, LogOut, LayoutDashboard, Heart } from "./Icons";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useCatalog } from "../../context/CatalogContext";
import { ADMIN_PANEL_ROLES } from "../../utils/constants";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [openMobileCat, setOpenMobileCat] = useState(null);
    const [hoveredCat, setHoveredCat] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { totalItems } = useCart();
    const { count: wishCount } = useWishlist();
    const { user, isAuthenticated, logout } = useAuth();
    const { categories } = useCatalog();

    const canAdmin = isAuthenticated && ADMIN_PANEL_ROLES.includes(user.role);

    const activeCategoryParam = searchParams.get("category");
    const activeSubParam = searchParams.get("sub");
    const activeCategory = categories.find((c) => c.name === activeCategoryParam);
    const showRefineBar = location.pathname === "/products" && activeCategory && activeCategory.subcategories.length > 0;

    const linkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors ${isActive ? "text-leaf" : "text-forest/70 hover:text-leaf"}`;

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query.trim())}`);
            setOpen(false);
        }
    };

    const handleSubClick = (sub) => {
        const next = new URLSearchParams(searchParams);
        if (activeSubParam === sub) next.delete("sub");
        else next.set("sub", sub);
        setSearchParams(next);
    };

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate("/");
    };

    const iconLink = "flex items-center gap-1.5 text-sm font-medium text-forest/70 hover:text-leaf transition-colors";

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-forest/10">
            {/* Top utility bar */}
            <div className="hidden sm:block bg-forest text-white/80 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center">
                    <span>Fresh, eco-friendly picks delivered across Bangladesh</span>
                    <div className="flex gap-4">
                        <Link to="/my-orders" className="hover:text-white hover:underline underline-offset-2 transition-colors">Track Order</Link>
                        <Link to="/resend-verification" className="hover:text-white hover:underline underline-offset-2 transition-colors">Verify Email</Link>
                    </div>
                </div>
            </div>

            {/* Main navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 sm:gap-8 h-16">
                    <Link to="/" className="font-display text-2xl font-semibold text-forest tracking-tight shrink-0">
                        Eco<span className="text-leaf">Bazaar</span>
                    </Link>

                    {/* Search — desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl" role="search">
                        <div className="relative w-full">
                            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products..."
                                aria-label="Search products"
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-forest/15 bg-white text-sm hover:border-leaf/50
                  focus:outline-none focus:ring-4 focus:ring-leaf/15 focus:border-leaf transition-all"
                            />
                        </div>
                    </form>

                    {/* Right actions */}
                    <div className="hidden md:flex items-center gap-5 ml-auto shrink-0">
                        {isAuthenticated ? (
                            <>
                                {canAdmin && (
                                    <Link to="/admin" className={iconLink}>
                                        <LayoutDashboard size={18} /> Admin
                                    </Link>
                                )}
                                <Link to="/profile" className={iconLink}>
                                    <User size={19} />
                                    <span className="max-w-[9rem] truncate">{user.name}</span>
                                </Link>
                                <button onClick={handleLogout} className={iconLink} aria-label="Sign out">
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className={iconLink}>
                                <User size={19} /> Sign in
                            </Link>
                        )}
                        <Link to="/wishlist" className="relative text-forest/70 hover:text-leaf transition-colors" aria-label={`Wishlist, ${wishCount} items`}>
                            <Heart size={20} />
                            {wishCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-leaf text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                                    {wishCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative text-forest/70 hover:text-leaf transition-colors" aria-label={`Cart, ${totalItems} items`}>
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-leaf text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    <button className="md:hidden ml-auto text-forest hover:text-leaf transition-colors" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Category strip — desktop */}
            <nav className="hidden md:block border-t border-forest/10 bg-white" aria-label="Categories">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center flex-wrap gap-x-6 gap-y-0 min-h-11">
                        <NavLink
                            to="/products"
                            end
                            className={({ isActive }) =>
                                `text-sm font-medium py-2.5 border-b-2 transition-colors ${isActive && !activeCategoryParam ? "text-leaf border-leaf" : "text-forest/70 border-transparent hover:text-leaf"}`
                            }
                        >
                            All Products
                        </NavLink>

                        {categories.map((cat) => {
                            const isActiveTab = activeCategoryParam === cat.name;
                            return (
                                <div key={cat.name} onMouseEnter={() => setHoveredCat(cat.name)} onMouseLeave={() => setHoveredCat(null)}>
                                    <Link
                                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                                        className={`block text-sm py-2.5 whitespace-nowrap border-b-2 transition-colors ${isActiveTab || hoveredCat === cat.name ? "text-leaf border-leaf font-medium" : "text-forest/70 border-transparent"}`}
                                    >
                                        {cat.name}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Refine bar */}
            {showRefineBar && (
                <div className="border-t border-forest/10 bg-mint">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-semibold text-forest whitespace-nowrap">
                                {activeCategory.name} <span className="text-slate/60 font-normal">— Refine</span>
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                                {activeCategory.subcategories.map((sub) => (
                                    <button
                                        key={sub}
                                        onClick={() => handleSubClick(sub)}
                                        className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap transition-colors ${activeSubParam === sub
                                            ? "bg-leaf text-white"
                                            : "bg-white border border-forest/15 text-forest/60 hover:border-leaf hover:text-leaf"}`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-forest/10 bg-white px-4 pb-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                    <form onSubmit={handleSearch} className="pt-3" role="search">
                        <div className="relative">
                            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products..."
                                aria-label="Search products"
                                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-forest/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf"
                            />
                        </div>
                    </form>

                    <nav className="flex flex-col pt-4">
                        <NavLink to="/products" end className={linkClass} onClick={() => setOpen(false)}>
                            <span className="block py-2">All Products</span>
                        </NavLink>

                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isOpen = openMobileCat === cat.name;
                            return (
                                <div key={cat.name} className="border-b border-forest/5 last:border-0">
                                    <button
                                        onClick={() => setOpenMobileCat(isOpen ? null : cat.name)}
                                        aria-expanded={isOpen}
                                        className="w-full flex items-center justify-between py-2.5 text-sm text-forest/70 hover:text-leaf transition-colors"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Icon size={16} className="text-leaf" />
                                            {cat.name}
                                        </span>
                                        <ChevronDown size={15} className={`text-forest/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {isOpen && (
                                        <div className="pl-7 pb-2 flex flex-col gap-1.5">
                                            <Link to={`/products?category=${encodeURIComponent(cat.name)}`} onClick={() => setOpen(false)} className="text-xs font-medium text-leaf py-1">
                                                View all {cat.name}
                                            </Link>
                                            {cat.subcategories.map((sub) => (
                                                <Link
                                                    key={sub}
                                                    to={`/products?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`}
                                                    onClick={() => setOpen(false)}
                                                    className="text-xs text-slate hover:text-leaf py-1"
                                                >
                                                    {sub}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-4 mt-2 border-t border-forest/10">
                            <Link to="/wishlist" onClick={() => setOpen(false)} className={iconLink}>
                                <Heart size={18} /> Wishlist{wishCount > 0 && ` (${wishCount})`}
                            </Link>
                            <Link to="/cart" onClick={() => setOpen(false)} className={iconLink}>
                                <ShoppingCart size={18} /> Cart{totalItems > 0 && ` (${totalItems})`}
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    {canAdmin && (
                                        <Link to="/admin" onClick={() => setOpen(false)} className={iconLink}>
                                            <LayoutDashboard size={18} /> Admin
                                        </Link>
                                    )}
                                    <Link to="/profile" onClick={() => setOpen(false)} className={iconLink}>
                                        <User size={18} /> {user.name}
                                    </Link>
                                    <button onClick={handleLogout} className={iconLink}>
                                        <LogOut size={18} /> Sign out
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setOpen(false)} className={iconLink}>
                                    <User size={18} /> Sign in
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
