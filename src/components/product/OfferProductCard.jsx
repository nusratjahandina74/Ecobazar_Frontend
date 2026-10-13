import { Link } from "react-router";
import { ShoppingCart } from "../common/Icons";
import { ProductImage, useAddToCart } from "./ProductCard";
import WishlistButton from "./WishlistButton";
import { formatBDT } from "../../utils/adapters";


export default function OfferProductCard({ product }) {
    const { add, isPending } = useAddToCart();
    const outOfStock = product.stock <= 0;
    const pending = isPending(product._id);

    return (
        <div className="group relative bg-white rounded-xl border border-forest/10 overflow-hidden card-hover shrink-0 w-44 sm:w-56">
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
                            <span className="text-white text-xs font-semibold uppercase px-3 py-1 bg-forest/80 rounded-full">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="absolute top-3 right-3 z-10">
                <WishlistButton product={product} />
            </div>

            <div className="p-3.5">
                <Link to={`/products/${product._id}`}>
                    <h3 className="text-sm font-semibold text-forest line-clamp-2 hover:text-leaf transition-colors min-h-[2.5rem]">
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mt-2">
                    <span className="font-display text-base font-semibold text-forest">{formatBDT(product.salePrice)}</span>
                    {product.hasDiscount && (
                        <span className="text-xs text-slate/60 line-through">{formatBDT(product.price)}</span>
                    )}
                </div>

                <button
                    disabled={outOfStock || pending}
                    onClick={() => add(product, 1)}
                    className="w-full mt-3 flex items-center justify-center gap-1.5 bg-leaf text-white text-xs font-semibold py-2 rounded-lg
            hover:bg-forest transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-leaf"
                >
                    <ShoppingCart size={13} /> {pending ? "Adding…" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}
