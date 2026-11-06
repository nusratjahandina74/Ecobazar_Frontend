import api from "./axiosInstance";
import { normalizeOrder } from "../utils/adapters";

// POST /payment -> { paymentUrl, orderId, transactionId }
export const initiatePayment = (shipping) => api.post("/payment", shipping).then((r) => r.data);

// GET /myorders (added to the backend; scoped to the signed-in user)
export const getMyOrders = () => api.get("/myorders").then((r) => (r.data.data || []).map(normalizeOrder));

// GET /orderbytransaction/:txnId — the VERIFIED status stored by the backend
export const getOrderByTransaction = (txnId) =>
    api.get(`/orderbytransaction/${encodeURIComponent(txnId)}`).then((r) => normalizeOrder(r.data.data));

// GET /allorders (admin only)
export const getAllOrders = () => api.get("/allorders").then((r) => (r.data.data || []).map(normalizeOrder));

// POST /updateorderstatus/:id (admin only)
export const updateOrderStatus = (id, orderStatus) =>
    api.post(`/updateorderstatus/${id}`, { orderStatus }).then((r) => normalizeOrder(r.data.data));
