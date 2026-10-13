import { useState } from "react";
import { useParams, Link } from "react-router";
import { ShoppingCart, Truck, ShieldCheck, Package, Minus, Plus } from "../../components/common/Icons";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import { useAddToCart } from "../../components/product/ProductCard";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateViews";
import useFetch from "../../hooks/useFetch";
import { getProduct } from "../../api/productApi";
import WishlistButton from "../../components/product/WishlistButton";
import { formatBDT } from "../../utils/adapters";

export default function ProductDetails() {
    const { id } = useParams();
    const [qty, setQty] = useState(1);
    const { add, isPending } = useAddToCart();
    const { data: product, loading, error, reload } = useFetch((signal) => getProduct(id, { signal }), [id]);

    if (loading) return <PageLoader />;
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <ErrorState message={error} onRetry={reload} />
                <p className="text-center"><Link to="/products" className="text-sm text-leaf hover:underline">Back to products</Link></p>
            </div>
        );
    }
    if (!product) return null;

    const outOfStock = product.stock <= 0;
    const pending = isPending(product._id);
    const maxQty = Math.max(1, product.stock);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <nav className="text-sm text-slate mb-6 flex flex-wrap items-center gap-x-2" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-leaf">Home</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-leaf">Products</Link>
                {product.category && (
                    <>
                        <span>/</span>
                        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-leaf">{product.category}</Link>
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

                    <div className="flex items-center gap-3 mt-4">
                        <span className="font-display text-3xl font-semibold text-forest">{formatBDT(product.salePrice)}</span>
                        {product.hasDiscount && (
                            <>
                                <span className="text-base text-slate/60 line-through">{formatBDT(product.price)}</span>
                                <span className="text-xs font-semibold text-leaf-dark bg-leaf/10 px-2 py-1 rounded-full">-{product.discountPercent}%</span>
                            </>
                        )}
                    </div>

                    <div className="mt-3">
                        {outOfStock ? (
                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">Out of Stock</span>
                        ) : (
                            <span className="text-xs font-semibold text-leaf-dark bg-leaf/10 px-2.5 py-1 rounded-full">{product.stock} in stock</span>
                        )}
                    </div>

                    {(product.shortDescription || product.description) && (
                        <p className="text-slate text-sm leading-relaxed mt-5">{product.shortDescription || product.description}</p>
                    )}

                    <div className="mt-8 p-5 rounded-xl border border-forest/10 bg-white">
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-sm font-medium text-forest">Quantity</span>
                            <div className="flex items-center border border-forest/15 rounded-lg w-fit">
                                <button
                                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                                    disabled={outOfStock || qty <= 1}
                                    aria-label="Decrease quantity"
                                    className="w-9 h-9 flex items-center justify-center text-forest/60 hover:text-leaf disabled:opacity-30 transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-10 text-center text-sm font-medium" aria-live="polite">{qty}</span>
                                <button
                                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                                    disabled={outOfStock || qty >= maxQty}
                                    aria-label="Increase quantity"
                                    className="w-9 h-9 flex items-center justify-center text-forest/60 hover:text-leaf disabled:opacity-30 transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={outOfStock || pending}
                            onClick={() => add(product, qty)}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-leaf text-white text-sm font-semibold
                hover:bg-leaf-dark hover:shadow-lg hover:shadow-leaf/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-leaf disabled:hover:shadow-none"
                        >
                            <ShoppingCart size={17} /> {pending ? "Adding…" : outOfStock ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <WishlistButton product={product} variant="button" className="w-full mt-3" />
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
                                    <p className="text-sm text-slate leading-relaxed whitespace-pre-line">{product.description}</p>
                                </>
                            )}
                            {product.additionalInformation && (
                                <>
                                    <h2 className="text-sm font-semibold text-forest mt-5 mb-2">Additional Information</h2>
                                    <p className="text-sm text-slate leading-relaxed whitespace-pre-line">{product.additionalInformation}</p>
                                </>
                            )}
                            {product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-5">
                                    {product.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            to={`/products?search=${encodeURIComponent(tag)}`}
                                            className="text-xs px-2.5 py-1 rounded-full bg-mint text-leaf-dark hover:bg-leaf hover:text-white transition-colors"
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
        </div>
    );
}
