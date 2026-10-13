import api from "./axiosInstance";
import { normalizeProduct } from "../utils/adapters";

// GET /wishlist -> { data: [{ _id, product, addedAt }] }
export async function fetchWishlist() {
    const res = await api.get("/wishlist");
    return (res.data.data || []).filter((r) => r.product).map((r) => normalizeProduct(r.product));
}

// POST /wishlist/:productId (idempotent)
export const addWishlistApi = (productId) => api.post(`/wishlist/${productId}`).then((r) => r.data);

// DELETE /wishlist/:productId (idempotent)
export const removeWishlistApi = (productId) => api.delete(`/wishlist/${productId}`).then((r) => r.data);
