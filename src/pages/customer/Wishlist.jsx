import { Link } from "react-router";
import { Heart } from "../../components/common/Icons";
import ProductCard from "../../components/product/ProductCard";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState, EmptyState } from "../../components/common/StateViews";
import { useWishlist } from "../../context/WishlistContext";

export default function Wishlist() {
    const { items, loading, error } = useWishlist();

    return (
        <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
                <Heart size={24} className="text-red-500" fill="currentColor" />
                <div>
                    <h1 className="text-3xl font-semibold font-display text-forest">My Wishlist</h1>
                    <p className="text-sm text-slate">{items.length} saved {items.length === 1 ? "product" : "products"}</p>
                </div>
            </div>

            {loading ? <PageLoader /> : error ? <ErrorState message={error} /> : items.length === 0 ? (
                <EmptyState
                    title="Your wishlist is empty"
                    text="Tap the heart on any product to save it here."
                    action={<Link to="/products" className="px-5 py-2.5 rounded-lg bg-leaf text-white text-sm font-semibold hover:bg-leaf-dark transition-colors">Browse products</Link>}
                />
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
                    {items.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>
            )}
        </div>
    );
}
