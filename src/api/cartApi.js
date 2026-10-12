import api from "./axiosInstance";
import { normalizeCartItem } from "../utils/adapters";

// GET /getcart/:userId -> { totalPrice, data }. Empty cart is HTTP 404 -> [].
export async function fetchCart(userId) {
    try {
        const res = await api.get(`/getcart/${userId}`);
        return { items: (res.data.data || []).map(normalizeCartItem), totalPrice: Number(res.data.totalPrice) || 0 };
    } catch (err) {
        if (err.status === 404) return { items: [], totalPrice: 0 };
        throw err;
    }
}

// POST /createcart { proId, userId }  — adds 1, or increments an existing row
export const addToCartApi = (userId, proId) => api.post("/createcart", { proId, userId }).then((r) => r.data);

// POST /incredecrecart/:cartId { type: "plus" | "minus", userId }
export const changeQuantityApi = (userId, cartId, type) =>
    api.post(`/incredecrecart/${cartId}`, { type, userId }).then((r) => r.data);

// DELETE /deletecart/:cartId
export const removeCartItemApi = (cartId) => api.delete(`/deletecart/${cartId}`).then((r) => r.data);
