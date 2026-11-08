import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, Truck, ShieldCheck, Package, Sparkles, Gift, Leaf, RefreshCw, Headphones, Clock, Star } from "../../components/common/Icons";
import ProductCard from "../../components/product/ProductCard";
import OfferSlider from "../../components/product/OfferSlider";
import HeroProductSlider from "../../components/product/HeroProductSlider";
import BannerSlider from "../../components/product/BannerSlider";
import CategoryGrid from "../../components/product/CategoryGrid";
import CategoryTiles from "../../components/product/CategoryTiles";
import FlashSale from "../../components/product/FlashSale";
import Testimonials from "../../components/product/Testimonials";
import RecentlyViewed from "../../components/product/RecentlyViewed";
import { useSettings } from "../../context/SettingsContext";
import usePageTitle from "../../hooks/usePageTitle";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState, EmptyState } from "../../components/common/StateViews";
import { useCatalog } from "../../context/CatalogContext";

const ICONS = { truck: Truck, shield: ShieldCheck, refresh: RefreshCw, headset: Headphones, leaf: Leaf, gift: Gift, clock: Clock, star: Star };
const DEFAULT_BADGES = [
    { icon: "truck", title: "Fast delivery", text: "Across Bangladesh" },
    { icon: "shield", title: "Secure payment", text: "Cash on delivery or online" },
    { icon: "refresh", title: "Easy returns", text: "Hassle-free return policy" },
    { icon: "headset", title: "Real support", text: "We reply on WhatsApp" },
];

function SectionHeader({ title, subtitle, showLink = true }) {
    return (
        <div className="flex items-end justify-between gap-3 mb-5 sm:mb-6">
            <div className="min-w-0">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-forest">{title}</h2>
                <p className="text-sm text-slate mt-1">{subtitle}</p>
            </div>
            {showLink && (
                <Link to="/products" className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-leaf transition-colors py-2">
                    View all <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

export default function Home() {
    const { activeProducts, categories, loading, error, reload } = useCatalog();

    const { settings } = useSettings();
    const home = settings.home;
    usePageTitle("");

    const { heroProducts, deals, featured, newArrivals, bestSellers, flashProducts } = useMemo(() => {
        const inStock = activeProducts.filter((p) => p.stock > 0);
        const newest = [...inStock].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        const picked = inStock.filter((p) => p.isFeatured);
        const ids = new Set(home.flash?.productIds || []);
        return {
            heroProducts: newest.filter((p) => p.mainImage).slice(0, 5),
            deals: inStock.filter((p) => p.hasDiscount),
            featured: (picked.length ? picked : inStock).slice(0, 8),
            newArrivals: newest.slice(0, 4),
            bestSellers: [...inStock].filter((p) => p.soldCount > 0).sort((a, b) => b.soldCount - a.soldCount).slice(0, 4),
            flashProducts: inStock.filter((p) => ids.has(p._id)),
        };
    }, [activeProducts, home.flash?.productIds]);
    const tiles = categories.filter((c) => c.showOnHome !== false);
    const badges = home.badges?.length ? home.badges : DEFAULT_BADGES;

    return (
        <div>
            <BannerSlider />
            {/* Hero */}
            <section className="bg-gradient-to-br from-forest via-leaf-dark to-leaf relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="max-w-xl min-w-0">
                            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight [overflow-wrap:anywhere]">
                                {settings.store?.tagline || "Everything you need, delivered to your door."}
                            </h1>
                            <p className="text-white/80 text-base mt-4 max-w-md">
                                Shop {settings.store?.name || "our store"} online with cash on delivery or secure online payment, delivered across Bangladesh.
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 mt-7 bg-white text-leaf-dark font-semibold text-sm px-6 py-3 rounded-lg transition-all"
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    {badges.map(({ icon, title: label, text: desc }) => { const Icon = ICONS[icon] || Sparkles; return (
                        <div key={label} className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-leaf/10 flex items-center justify-center shrink-0">
                                <Icon size={19} className="text-leaf" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-forest">{label}</p>
                                <p className="text-xs text-slate">{desc}</p>
                            </div>
                        </div>); })}
                </div>
            </section>

            {loading && <PageLoader />}
            {!loading && error && <ErrorState message={error} onRetry={reload} />}

            {!loading && !error && (
                <>
                    <FlashSale flash={home.flash} products={flashProducts} />
                    <OfferSlider products={deals} title="Today's Deals" subtitle="Discounted products — grab them before they're gone" />

                    {home.showCategories !== false && tiles.length > 0 && (
                        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                            <SectionHeader title="Shop by Category" subtitle="Browse our departments" showLink={false} />
                            {tiles.some((c) => c.image) ? <CategoryTiles categories={tiles} /> : <CategoryGrid categories={tiles} />}
                        </section>
                    )}

                    {featured.length === 0 ? (
                        <EmptyState title="No products yet" text="The store is being stocked. Please check back soon." />
                    ) : (
                        <>
                            {home.showFeatured !== false && (
                                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                    <SectionHeader title="Featured Products" subtitle="Hand-picked products our customers love" />
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {featured.map((product) => <ProductCard key={product._id} product={product} />)}
                                    </div>
                                </section>
                            )}
                            {home.showBestSellers !== false && bestSellers.length > 0 && (
                                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                                    <SectionHeader title="Best Sellers" subtitle="What everyone is buying" />
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {bestSellers.map((product) => <ProductCard key={product._id} product={product} />)}
                                    </div>
                                </section>
                            )}
                            {home.showNewArrivals !== false && (
                                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                                    <SectionHeader title="New Arrivals" subtitle="Just landed in our store" />
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {newArrivals.map((product) => <ProductCard key={product._id} product={product} />)}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                    {home.showTestimonials !== false && <Testimonials />}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><RecentlyViewed /></div>
                </>
            )}
        </div>
    );
}
