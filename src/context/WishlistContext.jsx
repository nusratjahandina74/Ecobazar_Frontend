import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchWishlist, addWishlistApi, removeWishlistApi } from "../api/wishlistApi";
import { useAuth } from "./AuthContext";
import { ApiError } from "../api/axiosInstance";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const userId = user?._id;
    const [items, setItems] = useState([]); // normalized products
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        if (!userId) { setItems([]); setError(""); return; }
        setLoading(true);
        setError("");
        fetchWishlist()
            .then((list) => { if (!cancelled) setItems(list); })
            .catch((err) => { if (!cancelled) setError(err.message); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [userId]);

    const ids = useMemo(() => new Set(items.map((p) => p._id)), [items]);
    const isWishlisted = useCallback((productId) => ids.has(productId), [ids]);
    const toggleWishlist = useCallback(async (product) => {
        if (!userId) throw new ApiError("Please sign in to use your wishlist.", { status: 401 });
        const wasIn = ids.has(product._id);
        setItems((prev) => (wasIn ? prev.filter((p) => p._id !== product._id) : [product, ...prev]));
        try {
            if (wasIn) await removeWishlistApi(product._id);
            else await addWishlistApi(product._id);
            return !wasIn;
        } catch (err) {
            setItems((prev) => (wasIn ? [product, ...prev.filter((p) => p._id !== product._id)] : prev.filter((p) => p._id !== product._id)));
            throw err;
        }
    }, [userId, ids]);

    const value = useMemo(
        () => ({ items, count: items.length, loading, error, isWishlisted, toggleWishlist }),
        [items, loading, error, isWishlisted, toggleWishlist]
    );
    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
    return ctx;
}
