import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, Truck, ShieldCheck, Package, Sparkles } from "../../components/common/Icons";
import ProductCard from "../../components/product/ProductCard";
import OfferSlider from "../../components/product/OfferSlider";
import HeroProductSlider from "../../components/product/HeroProductSlider";
import CategoryGrid from "../../components/product/CategoryGrid";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState, EmptyState } from "../../components/common/StateViews";
import { useCatalog } from "../../context/CatalogContext";

const trustPoints = [
    { icon: Sparkles, label: "Eco-friendly picks", desc: "Chosen with the planet in mind" },
    { icon: ShieldCheck, label: "Secure payment", desc: "Pay safely via aamarPay" },
    { icon: Truck, label: "Delivery in Bangladesh", desc: "Shipped to your address" },
    { icon: Package, label: "Track your orders", desc: "See every order's status" },
];

function SectionHeader({ title, subtitle, showLink = true }) {
    return (
        <div className="flex items-end justify-between mb-6">
            <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-forest">{title}</h2>
                <p className="text-sm text-slate mt-1">{subtitle}</p>
            </div>
            {showLink && (
                <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-leaf hover:text-forest transition-colors">
                    View all <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

export default function Home() {
    const { activeProducts, categories, loading, error, reload } = useCatalog();

    const { heroProducts, deals, featured, newArrivals } = useMemo(() => {
        const inStock = activeProducts.filter((p) => p.stock > 0);
        const newest = [...inStock].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return {
            heroProducts: newest.filter((p) => p.mainImage).slice(0, 5),
            deals: inStock.filter((p) => p.hasDiscount),
            featured: inStock.slice(0, 4),
            newArrivals: newest.slice(0, 4),
        };
    }, [activeProducts]);

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-forest via-leaf-dark to-leaf relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="max-w-xl">
                            <p className="text-white/80 text-sm font-semibold tracking-wide uppercase mb-3">Shop green, live better</p>
                            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight">
                                Everything you need, delivered to your door.
                            </h1>
                            <p className="text-white/80 text-base mt-4 max-w-md">
                                Discover eco-friendly products across every category, with secure checkout and delivery across Bangladesh.
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 mt-7 bg-white text-leaf-dark font-semibold text-sm px-6 py-3 rounded-lg hover:bg-forest hover:text-white hover:gap-3 transition-all"
                            >
                                Shop Now <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="hidden lg:block">
                            <HeroProductSlider products={heroProducts} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust strip */}
            <section className="border-b border-forest/10 bg-mint/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {trustPoints.map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-leaf/10 flex items-center justify-center shrink-0">
                                <Icon size={19} className="text-leaf" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-forest">{label}</p>
                                <p className="text-xs text-slate">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {loading && <PageLoader />}
            {!loading && error && <ErrorState message={error} onRetry={reload} />}

            {!loading && !error && (
                <>
                    <OfferSlider products={deals} title="Today's Deals" subtitle="Discounted products — grab them before they're gone" />

                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                        <SectionHeader title="Shop by Category" subtitle="Browse our full range of departments" showLink={false} />
                        <CategoryGrid categories={categories} />
                    </section>

                    {featured.length === 0 ? (
                        <EmptyState
                            title="No products yet"
                            text="The store is being stocked. Please check back soon."
                        />
                    ) : (
                        <>
                            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                <SectionHeader title="Featured Products" subtitle="Hand-picked products our customers love" />
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {featured.map((product) => <ProductCard key={product._id} product={product} />)}
                                </div>
                            </section>

                            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                                <div className="bg-mint border border-leaf/20 rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="text-center sm:text-left">
                                        <p className="text-leaf text-sm font-semibold uppercase tracking-wide mb-2">Go green</p>
                                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-forest">
                                            Small choices, big impact on the planet
                                        </h3>
                                        <p className="text-slate text-sm mt-2">Explore sustainable products across every category.</p>
                                    </div>
                                    <Link
                                        to="/products"
                                        className="shrink-0 bg-leaf text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-forest transition-colors"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            </section>

                            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
                                <SectionHeader title="New Arrivals" subtitle="Just landed in our store" />
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {newArrivals.map((product) => <ProductCard key={product._id} product={product} />)}
                                </div>
                            </section>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
