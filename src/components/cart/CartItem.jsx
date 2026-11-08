import { Link } from "react-router";
import { Trash2 } from "../common/Icons";
import QuantitySelector from "./QuantitySelector";
import { ProductImage } from "../product/ProductCard";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatBDT } from "../../utils/adapters";

export default function CartItem({ item }) {
    const { incrementQuantity, decrementQuantity, removeFromCart } = useCart();
    const toast = useToast();

    const run = (fn) => fn(item.cartId).catch((err) => toast.error(err.message));

    return (
        <div className={`flex gap-3 sm:gap-4 py-4 sm:py-5 border-b border-forest/10 last:border-0 `}>
            <Link to={`/products/${item.productId}`} className="w-20 h-20 overflow-hidden rounded-lg sm:w-24 sm:h-24 bg-mint shrink-0">
                <ProductImage src={item.image} alt={item.title} className="object-cover w-full h-full" />
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                    <Link to={`/products/${item.productId}`} className="min-w-0 text-sm font-semibold transition-colors text-forest line-clamp-2 [overflow-wrap:anywhere]">
                        {item.title}
                    </Link>
                    <button
                        onClick={() => run(removeFromCart)}
                        className="transition-colors text-slate/60 shrink-0 p-1.5 -m-1.5"
                        aria-label={`Remove ${item.title} from cart`}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {item.variantLabel && <p className="mt-1 text-xs font-medium text-leaf-dark">{item.variantLabel}</p>}
                <p className="mt-1 text-sm text-slate">{formatBDT(item.price)} each</p>

                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mt-3">
                    <QuantitySelector
                        value={item.quantity}
                        max={item.stock}
                        onIncrement={() => run(incrementQuantity)}
                        onDecrement={() => run(decrementQuantity)}
                    />
                    <span className="text-base font-semibold font-display text-forest">{formatBDT(item.price * item.quantity)}</span>
                </div>

                {item.stock > 0 && item.quantity >= item.stock && (
                    <p className="text-xs text-leaf-dark mt-1.5">Maximum available stock reached</p>
                )}
                {item.quantity > item.stock && (
                    <p role="alert" className="text-xs text-red-600 mt-1.5">Only {item.stock} left in stock — please reduce the quantity.</p>
                )}
            </div>
        </div>
    );
}
