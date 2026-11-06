import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ShoppingCart, Truck, ShieldCheck, Package, Minus, Plus, MessageCircle, Share2 } from "../../components/common/Icons";
import ReviewsSection from "../../components/product/ReviewsSection";
import RecentlyViewed from "../../components/product/RecentlyViewed";
import { RatingBadge } from "../../components/common/Stars";
import { useSettings } from "../../context/SettingsContext";
import usePageTitle from "../../hooks/usePageTitle";
import { pushRecent } from "../../utils/recent";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import { useAddToCart } from "../../components/product/ProductCard";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateViews";
import useFetch from "../../hooks/useFetch";
import { getProduct } from "../../api/productApi";
import WishlistButton from "../../components/product/WishlistButton";
import { formatBDT } from "../../utils/adapters";
import { useToast } from "../../context/ToastContext";

export default function ProductDetails() {
    const { id } = useParams();
    const [qty, setQty] = useState(1);
    const [variantId, setVariantId] = useState(null);
    const { add, isPending } = useAddToCart();
    const toast = useToast();
    const { data: product, loading, error, reload } = useFetch((signal) => getProduct(id, { signal }), [id]);
    const { settings } = useSettings();
    usePageTitle(product?.title, product ? (product.shortDescription || product.description.replace(/<[^>]+>/g, " ")).slice(0, 155) : undefined);
    useEffect(() => { if (product?._id) pushRecent(product._id); }, [product?._id]);

    if (loading) return <PageLoader />;
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <ErrorState message={error} onRetry={reload} />
                <p className="text-center"><Link to="/products" className="text-sm text-leaf">Back to products</Link></p>
            </div>
        );
    }
    if (!product) return null;

    const hasVariants = product.variants.length > 0;
    const variant = hasVariants ? product.variants.find((v) => v._id === variantId) : null;
    const salePrice = variant ? variant.salePrice : product.salePrice;
    const regularPrice = variant ? variant.price : product.price;
    const hasDiscount = variant ? variant.hasDiscount : product.hasDiscount;
    const stock = variant ? variant.stock : product.stock;
    const needsChoice = hasVariants && !variant;
    const outOfStock = hasVariants ? product.variants.every((v) => v.stock <= 0) : product.stock <= 0;
    const soldOutChoice = !!variant && variant.stock <= 0;
    const pending = isPending(product._id);
    const maxQty = Math.max(1, stock);
    const isHtml = (t) => /<\/?[a-z][\s\S]*>/i.test(t || "");

    const wa = settings.whatsapp;
    const waHref = wa?.phone ? `https://wa.me/${String(wa.phone).replace(/[^\d]/g, "").replace(/^0/, "880")}?text=${encodeURIComponent(`Hi, I want to order: ${product.title}${variant ? ` (${variant.label})` : ""} - ${window.location.href}`)}` : "";
    const share = async () => {
        const data = { title: product.title, url: window.location.href };
        try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(data.url); toast.success("Link copied"); } } catch { /* cancelled */ }
    };
    const canBuy = !(outOfStock || pending || needsChoice || soldOutChoice);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 lg:pb-10">
            <nav className="text-sm text-slate mb-6 flex flex-wrap items-center gap-x-2" aria-label="Breadcrumb">
                <Link to="/" className="">Home</Link>
                <span>/</span>
                <Link to="/products" className="">Products</Link>
                {product.category && (
                    <>
                        <span>/</span>
                        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="">{product.category}</Link>
                    </>
                )}
                <span>/</span>
                <span className="text-forest">{product.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <ProductImageGallery images={product.images} title={product.title} />

                <div>
                    <p className="text-xs text-leaf font-medium uppercase tracking-wide">
                        {product.category}{product.subCategory && <span className="text-slate/60"> · {product.subCategory}</span>}
                    </p>
                    <h1 className="font-display text-3xl font-semibold text-forest mt-2">{product.title}</h1>

                    {product.ratingCount > 0 && <a href="#reviews" className="inline-block mt-2"><RatingBadge value={product.ratingAvg} count={product.ratingCount} size={16} /></a>}

                    <div className="flex items-center gap-3 mt-4">
                        <span className="font-display text-3xl font-semibold text-forest">{formatBDT(salePrice)}</span>
                        {hasDiscount && (
                            <>
                                <span className="text-base text-slate/60 line-through">{formatBDT(regularPrice)}</span>
                                <span className="text-xs font-semibold text-leaf-dark bg-leaf/10 px-2 py-1 rounded-full">-{Math.round((1 - salePrice / regularPrice) * 100)}%</span>
                            </>
                        )}
                    </div>

                    <div className="mt-3">
                        {outOfStock ? (
                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">Out of Stock</span>
                        ) : (
                            <span className="text-xs font-semibold text-leaf-dark bg-leaf/10 px-2.5 py-1 rounded-full">{needsChoice ? "Choose an option" : stock <= 5 ? `Only ${stock} left - order soon` : `${stock} in stock`}</span>
                        )}
                    </div>

                    {(product.shortDescription || product.description) && (
                        <p className="text-slate text-sm leading-relaxed mt-5">{product.shortDescription || product.description.replace(/<[^>]+>/g, " ").slice(0, 220)}</p>
                    )}

                    {hasVariants && (
                        <fieldset className="mt-6">
                            <legend className="text-sm font-medium text-forest mb-2">Choose option</legend>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((v) => (
                                    <button
                                        key={v._id}
                                        type="button"
                                        disabled={v.stock <= 0}
                                        aria-pressed={variantId === v._id}
                                        onClick={() => { setVariantId(v._id); setQty(1); }}
                                        className={`px-3.5 py-2 rounded-lg border text-sm ${variantId === v._id ? "border-leaf bg-mint text-leaf-dark font-semibold" : "border-forest/15 text-forest"} disabled:opacity-40 disabled:line-through`}
                                    >
                                        {v.label}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    )}

                    <div className="mt-8 p-5 rounded-xl border border-forest/10 bg-white">
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-sm font-medium text-forest">Quantity</span>
                            <div className="flex items-center border border-forest/15 rounded-lg w-fit">
                                <button
                                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                                    disabled={outOfStock || needsChoice || qty <= 1}
                                    aria-label="Decrease quantity"
                                    className="w-9 h-9 flex items-center justify-center text-forest/60 disabled:opacity-30 transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-10 text-center text-sm font-medium" aria-live="polite">{qty}</span>
                                <button
                                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                                    disabled={outOfStock || needsChoice || qty >= maxQty}
                                    aria-label="Increase quantity"
                                    className="w-9 h-9 flex items-center justify-center text-forest/60 disabled:opacity-30 transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={outOfStock || pending || needsChoice || soldOutChoice}
                            onClick={() => add(product, qty, variantId)}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-leaf text-white text-sm font-semibold active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart size={17} /> {pending ? "Adding…" : outOfStock || soldOutChoice ? "Out of Stock" : needsChoice ? "Select an option" : "Add to Cart"}
                        </button>
                        <WishlistButton product={product} variant="button" className="w-full mt-3" />
                        {waHref && (
                            <a href={waHref} target="_blank" rel="noreferrer" className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-[#25D366] text-[#128C7E] text-sm font-semibold">
                                <MessageCircle size={17} /> Order or ask on WhatsApp
                            </a>)}
                        <button type="button" onClick={share} className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm text-slate"><Share2 size={15} /> Share this product</button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-6">
                        {[
                            { icon: Truck, label: "Delivery in Bangladesh" },
                            { icon: ShieldCheck, label: "Secure payment" },
                            { icon: Package, label: "Order tracking" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex flex-col items-center text-center gap-1.5 py-3 rounded-lg bg-mint">
                                <Icon size={18} className="text-leaf" />
                                <span className="text-xs text-slate">{label}</span>
                            </div>
                        ))}
                    </div>

                    {(product.description || product.additionalInformation || product.tags.length > 0) && (
                        <div className="mt-8 pt-6 border-t border-forest/10">
                            {product.description && (
                                <>
                                    <h2 className="text-sm font-semibold text-forest mb-2">Description</h2>
                                    {isHtml(product.description)
                                        ? <div className="rich text-sm text-slate leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                                        : <p className="text-sm text-slate leading-relaxed whitespace-pre-line">{product.description}</p>}
                                </>
                            )}
                            {product.additionalInformation && (
                                <>
                                    <h2 className="text-sm font-semibold text-forest mt-5 mb-2">Additional Information</h2>
                                    {isHtml(product.additionalInformation)
                                        ? <div className="rich text-sm text-slate leading-relaxed" dangerouslySetInnerHTML={{ __html: product.additionalInformation }} />
                                        : <p className="text-sm text-slate leading-relaxed whitespace-pre-line">{product.additionalInformation}</p>}
                                </>
                            )}
                            {product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-5">
                                    {product.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            to={`/products?search=${encodeURIComponent(tag)}`}
                                            className="text-xs px-2.5 py-1 rounded-full bg-mint text-leaf-dark transition-colors"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ReviewsSection productId={product._id} />
            <RecentlyViewed excludeId={product._id} />

            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-forest/10 px-4 py-3 flex items-center gap-3">
                <div className="min-w-0 flex-1"><p className="text-xs text-slate truncate">{product.title}</p><p className="font-display text-lg font-semibold text-forest leading-tight">{formatBDT(salePrice)}</p></div>
                <button type="button" disabled={!canBuy} onClick={() => add(product, qty, variantId)} className="shrink-0 px-5 py-3 rounded-lg bg-leaf text-white text-sm font-semibold disabled:opacity-50">
                    {outOfStock || soldOutChoice ? "Out of stock" : needsChoice ? "Choose option" : pending ? "Adding…" : "Add to cart"}
                </button>
            </div>
        </div>
    );
}
