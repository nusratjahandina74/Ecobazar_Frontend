import { useLocation, useNavigate } from "react-router";
import { Heart } from "../common/Icons";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function WishlistButton({ product, variant = "icon", className = "" }) {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const active = isWishlisted(product._id);

    const onClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }
        try {
            const nowIn = await toggleWishlist(product);
            toast.success(nowIn ? "Added to wishlist" : "Removed from wishlist");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const label = active ? "Remove from wishlist" : "Add to wishlist";

    if (variant === "button") {
        return (
            <button
                onClick={onClick}
                aria-pressed={active}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-all active:scale-[0.98]
          ${active ? "border-leaf bg-leaf/10 text-leaf-dark hover:bg-leaf hover:text-white" : "border-forest/15 text-forest/70 hover:border-leaf hover:text-leaf"} ${className}`}
            >
                <Heart size={17} fill={active ? "currentColor" : "none"} /> {active ? "In wishlist" : "Add to wishlist"}
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={`w-8 h-8 rounded-full bg-white/95 shadow flex items-center justify-center transition-all hover:scale-110 active:scale-95
        ${active ? "text-red-500" : "text-forest/50 hover:text-red-500"} ${className}`}
        >
            <Heart size={16} fill={active ? "currentColor" : "none"} />
        </button>
    );
}
