import { Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart, Package } from "../common/Icons";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatBDT } from "../../utils/adapters";

export function ProductImage({ src, alt, className = "" }) {
    if (!src) {
        return (
            <div className={`flex items-center justify-center bg-mint text-leaf/60 ${className}`} role="img" aria-label={alt}>
                <Package size={36} />
            </div>
        );
    }
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
            className={className}
        />
    );
}

// Shared add-to-cart behaviour: sends guests to /login, reports errors with a toast.
export function useAddToCart() {
    const { addToCart, isPending } = useCart();
    const { isAuthenticated } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const add = async (product, quantity = 1) => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }
        try {
            await addToCart(product, quantity);
            toast.success(`${product.title} added to cart`);
        } catch (err) {
            toast.error(err.message);
        }
    };
    return { add, isPending };
}

export default function ProductCard({ product }) {
    const { add, isPending } = useAddToCart();
    const outOfStock = product.stock <= 0;
    const pending = isPending(product._id);

    return (
        <div className="group relative bg-white rounded-xl border border-forest/10 overflow-hidden card-hover">
            <Link to={`/products/${product._id}`} aria-label={product.title}>
                <div className="relative aspect-square overflow-hidden bg-mint">
                    <ProductImage
                        src={product.mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discountPercent > 0 && (
                        <span className="absolute top-3 left-3 bg-leaf text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{product.discountPercent}%
                        </span>
                    )}
                    {outOfStock && (
                        <div className="absolute inset-0 bg-forest/50 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold uppercase tracking-wide px-3 py-1 bg-forest/80 rounded-full">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-4">
                <p className="text-xs text-leaf font-medium uppercase tracking-wide">{product.category}</p>
                <Link to={`/products/${product._id}`}>
                    <h3 className="text-sm font-semibold text-forest mt-1 line-clamp-2 hover:text-leaf transition-colors">
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-display text-lg font-semibold text-forest">{formatBDT(product.salePrice)}</span>
                        {product.hasDiscount && (
                            <span className="text-xs text-slate/60 line-through">{formatBDT(product.price)}</span>
                        )}
                    </div>
                    <button
                        disabled={outOfStock || pending}
                        onClick={() => add(product, 1)}
                        className="w-9 h-9 rounded-full bg-leaf text-white flex items-center justify-center
              hover:bg-forest hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-leaf"
                        aria-label={`Add ${product.title} to cart`}
                    >
                        <ShoppingCart size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
