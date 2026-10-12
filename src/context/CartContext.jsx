import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchCart, addToCartApi, changeQuantityApi, removeCartItemApi } from "../api/cartApi";
import { useAuth } from "./AuthContext";
import { ApiError } from "../api/axiosInstance";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const userId = user?._id;

    const [items, setItems] = useState([]);
    const [serverTotal, setServerTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pendingIds, setPendingIds] = useState([]);

    const reload = useCallback(async () => {
        if (!userId) {
            setItems([]);
            setServerTotal(0);
            return;
        }
        const { items: next, totalPrice } = await fetchCart(userId);
        setItems(next);
        setServerTotal(totalPrice);
    }, [userId]);

    // load the cart whenever the signed-in user changes (and clear it on logout)
    useEffect(() => {
        let cancelled = false;
        if (!userId) {
            setItems([]);
            setServerTotal(0);
            setError("");
            return;
        }
        setLoading(true);
        setError("");
        fetchCart(userId)
            .then(({ items: next, totalPrice }) => {
                if (cancelled) return;
                setItems(next);
                setServerTotal(totalPrice);
            })
            .catch((err) => { if (!cancelled) setError(err.message); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [userId]);

    const setPending = (id, on) =>
        setPendingIds((prev) => (on ? [...prev, id] : prev.filter((x) => x !== id)));

    // Runs a mutation, then re-reads the cart so the server stays the source of truth.
    const mutate = useCallback(async (pendingKey, fn) => {
        if (!userId) throw new ApiError("Please sign in to use your cart.", { status: 401 });
        setPending(pendingKey, true);
        setError("");
        try {
            await fn();
            await reload();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setPending(pendingKey, false);
        }
    }, [userId, reload]);

    // The backend adds one unit per call, so a quantity > 1 issues sequential calls.
    const addToCart = useCallback(
        (product, quantity = 1) =>
            mutate(product._id, async () => {
                for (let i = 0; i < quantity; i += 1) await addToCartApi(userId, product._id);
            }),
        [mutate, userId]
    );

    const incrementQuantity = useCallback(
        (cartId) => mutate(cartId, () => changeQuantityApi(userId, cartId, "plus")),
        [mutate, userId]
    );
    const decrementQuantity = useCallback(
        (cartId) => mutate(cartId, () => changeQuantityApi(userId, cartId, "minus")),
        [mutate, userId]
    );
    const removeFromCart = useCallback(
        (cartId) => mutate(cartId, () => removeCartItemApi(cartId)),
        [mutate]
    );

    const isPending = useCallback((id) => pendingIds.includes(id), [pendingIds]);

    const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
    const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

    const value = useMemo(
        () => ({
            items, loading, error, subtotal, serverTotal, totalItems,
            addToCart, incrementQuantity, decrementQuantity, removeFromCart, reload, isPending,
        }),
        [items, loading, error, subtotal, serverTotal, totalItems, addToCart, incrementQuantity, decrementQuantity, removeFromCart, reload, isPending]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
