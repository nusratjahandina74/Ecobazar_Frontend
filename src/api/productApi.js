import api from "./axiosInstance";
import { normalizeProduct } from "../utils/adapters";

// GET /allproduct -> { totalProducts, data }.  An empty catalog is HTTP 404 -> treated as [].
export async function getProducts({ signal } = {}) {
    try {
        const res = await api.get("/allproduct", { signal });
        return (res.data.data || []).map(normalizeProduct);
    } catch (err) {
        if (err.status === 404) return [];
        throw err;
    }
}

// GET /singleproduct/:id -> { data }
export async function getProduct(id, { signal } = {}) {
    const res = await api.get(`/singleproduct/${id}`, { signal });
    return normalizeProduct(res.data.data);
}

// POST /createproduct (multipart: text fields + repeated "photos")
export async function createProduct(formData, onUploadProgress) {
    const res = await api.post("/createproduct", formData, { onUploadProgress });
    return normalizeProduct(res.data.data);
}

// POST /updateproduct/:id (multipart)
export async function updateProduct(id, formData, onUploadProgress) {
    const res = await api.post(`/updateproduct/${id}`, formData, { onUploadProgress });
    return normalizeProduct(res.data.data);
}

// DELETE /deleteproduct/:id
export const deleteProduct = (id) => api.delete(`/deleteproduct/${id}`).then((r) => r.data);
