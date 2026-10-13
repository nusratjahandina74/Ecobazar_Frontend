import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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

    const itemsRef = useRef(items);
    useEffect(() => { itemsRef.current = items; }, [items]);
    const queues = useRef(new Map());
    const inflight = useRef(0);
    const dirty = useRef(false);

    const syncQuietly = useCallback(async () => {
        try { await reload(); } catch { /* keep the optimistic state if the refresh itself fails */ }
    }, [reload]);

    const enqueue = useCallback((cartId, task) => {
        inflight.current += 1;
        const prev = queues.current.get(cartId) || Promise.resolve();
        const next = prev
            .catch(() => { })
            .then(task)
            .catch((err) => { dirty.current = true; throw err; })
            .finally(() => {
                inflight.current -= 1;
                if (queues.current.get(cartId) === next) queues.current.delete(cartId);
                if (inflight.current === 0) { dirty.current = false; syncQuietly(); }
            });
        queues.current.set(cartId, next);
        return next;
    }, [syncQuietly]);

    const patchItem = (cartId, fn) =>
        setItems((prev) => prev.flatMap((i) => (i.cartId !== cartId ? [i] : fn(i) ? [fn(i)] : [])));

    const incrementQuantity = useCallback((cartId) => {
        const item = itemsRef.current.find((i) => i.cartId === cartId);
        if (!item) return Promise.resolve();
        if (item.quantity >= item.stock) {
            return Promise.reject(new ApiError(`Only ${item.stock} in stock.`, { status: 400 }));
        }
        patchItem(cartId, (i) => ({ ...i, quantity: i.quantity + 1 }));
        return enqueue(cartId, () => changeQuantityApi(userId, cartId, "plus"))
            .catch((err) => { setError(err.message); throw err; });
    }, [enqueue, userId]);

    const decrementQuantity = useCallback((cartId) => {
        const item = itemsRef.current.find((i) => i.cartId === cartId);
        if (!item || item.quantity <= 1) return Promise.resolve();
        patchItem(cartId, (i) => ({ ...i, quantity: i.quantity - 1 }));
        return enqueue(cartId, () => changeQuantityApi(userId, cartId, "minus"))
            .catch((err) => { setError(err.message); throw err; });
    }, [enqueue, userId]);

    const removeFromCart = useCallback((cartId) => {
        if (!itemsRef.current.some((i) => i.cartId === cartId)) return Promise.resolve();
        patchItem(cartId, () => null);
        return enqueue(cartId, () => removeCartItemApi(cartId))
            .catch((err) => { setError(err.message); throw err; });
    }, [enqueue]);

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

    const addToCart = useCallback(
        (product, quantity = 1) =>
            mutate(product._id, async () => {
                for (let i = 0; i < quantity; i += 1) await addToCartApi(userId, product._id);
            }),
        [mutate, userId]
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
