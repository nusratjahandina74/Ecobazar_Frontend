import api from "./axiosInstance";
import { resolveAssetUrl } from "./axiosInstance";

export const getPublicSettings = ({ signal } = {}) =>
    api.get("/public/settings", { signal }).then((r) => {
        const s = r.data.data;
        if (s?.store?.logo) s.store.logo = resolveAssetUrl(s.store.logo);
        return s;
    });

export const getBanners = ({ signal } = {}) =>
    api.get("/public/banners", { signal }).then((r) => (r.data.data || []).map((b) => ({ ...b, image: resolveAssetUrl(b.image) })));

export const sendContactMessage = (payload) => api.post("/public/contact", payload).then((r) => r.data);

export const getCategories = ({ signal } = {}) =>
    api.get("/public/categories", { signal }).then((r) => (r.data.data || []).map((c) => ({ ...c, image: c.image ? resolveAssetUrl(c.image) : "" })));
export const getPages = ({ signal } = {}) => api.get("/public/pages", { signal }).then((r) => r.data.data || []);
export const getPage = (slug, { signal } = {}) => api.get(`/public/pages/${encodeURIComponent(slug)}`, { signal }).then((r) => r.data.data);
export const getTestimonials = ({ signal } = {}) => api.get("/public/testimonials", { signal }).then((r) => r.data.data || []);
export const subscribeNewsletter = (email) => api.post("/public/subscribe", { email }).then((r) => r.data);
export const trackOrder = (orderNumber, phone) => api.post("/public/track", { orderNumber, phone }).then((r) => r.data.data);
export const getProductReviews = (id, params = {}) => api.get(`/products/${id}/reviews`, { params }).then((r) => r.data);
export const getReviewState = (id) => api.get(`/products/${id}/review-state`).then((r) => r.data.data);
export const submitReview = (id, body) => api.post(`/products/${id}/reviews`, body).then((r) => r.data);
export const previewCart = (body) => api.post("/cart/preview", body).then((r) => r.data.data);
