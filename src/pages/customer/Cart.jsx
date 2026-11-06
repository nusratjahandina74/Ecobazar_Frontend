import { Link } from "react-router";
import { ShoppingCart } from "../../components/common/Icons";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import { CartSkeleton } from "../../components/common/Loader";
import { ErrorState, EmptyState } from "../../components/common/StateViews";
import { formatBDT } from "../../utils/adapters";

export default function Cart() {
    const { items, subtotal, totalItems, loading, error, reload } = useCart();

    if (loading) return <CartSkeleton />;

    const hasProblem = items.some((i) => !i.available || i.quantity > i.stock);

    return (
        <div className="px-4 pt-8 pb-28 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pt-10 lg:pb-12">
            <h1 className="mb-6 text-3xl font-semibold font-display text-forest">Shopping Cart</h1>

            {error && items.length === 0 ? (
                <ErrorState message={error} onRetry={reload} />
            ) : items.length === 0 ? (
                <EmptyState
                    title="Your cart is empty"
                    text="Looks like you haven't added anything yet."
                    action={
                        <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-leaf text-white text-sm font-semibold transition-colors">
                            <ShoppingCart size={16} /> Start shopping
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {error && <p role="alert" className="mb-3 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg">{error}</p>}
                        <div className="px-5 bg-white border rounded-xl border-forest/10">
                            {items.map((item) => <CartItem key={item.cartId} item={item} />)}
                        </div>
                    </div>
                    <CartSummary items={items} subtotal={subtotal} itemCount={totalItems} disabled={hasProblem} />
                </div>
            )}

            {items.length > 0 && (
                <div className="fixed inset-x-0 bottom-0 z-40 px-4 py-3 bg-white border-t shadow-[0_-4px_16px_rgba(15,61,36,.08)] lg:hidden border-forest/10">
                    <div className="flex items-center gap-3 mx-auto max-w-7xl">
                        <div className="shrink-0">
                            <p className="text-xs text-slate">Subtotal</p>
                            <p className="text-lg font-semibold leading-tight font-display text-forest">{formatBDT(subtotal)}</p>
                        </div>
                        <Link to="/checkout" aria-disabled={hasProblem} tabIndex={hasProblem ? -1 : undefined}
                            className={`flex-1 text-center py-3 rounded-lg text-sm font-semibold ${hasProblem ? "bg-forest/10 text-forest/30 pointer-events-none" : "bg-leaf text-white"}`}>
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
