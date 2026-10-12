import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");
const TOKEN_KEY = "ecobazaar_access_token";

// ---- token storage (only the access token is persisted; never the password or a role) ----
export const tokenStorage = {
    get: () => {
        try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
    },
    set: (token) => {
        try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage unavailable */ }
    },
    clear: () => {
        try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
    },
};

// AuthContext registers a callback so an expired/invalid token logs the user out cleanly.
let unauthorizedHandler = null;
export const setUnauthorizedHandler = (fn) => { unauthorizedHandler = fn; };

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

axiosInstance.interceptors.request.use((config) => {
    const token = tokenStorage.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const STATUS_MESSAGES = {
    400: "The request was invalid. Please check your input.",
    401: "Your session has expired. Please sign in again.",
    403: "You do not have permission to do that.",
    404: "We could not find what you were looking for.",
    409: "This record already exists or conflicts with existing data.",
    413: "The uploaded file is too large.",
    429: "Too many attempts. Please wait a few minutes and try again.",
    500: "Something went wrong on our server. Please try again.",
};

export class ApiError extends Error {
    constructor(message, { status = 0, data = null, original = null } = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
        this.original = original;
    }
}

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        let message;
        let status = 0;
        let data = null;

        if (error.response) {
            status = error.response.status;
            data = error.response.data;
            message =
                (data && typeof data === "object" && data.message) ||
                STATUS_MESSAGES[status] ||
                `Request failed (${status}).`;
            if (status === 401 && tokenStorage.get() && unauthorizedHandler) unauthorizedHandler();
        } else if (error.code === "ECONNABORTED") {
            message = "The server took too long to respond. Please try again.";
        } else {
            // network error / CORS / server down
            message = "Cannot reach the server. Check your connection and that the backend is running.";
        }

        if (import.meta.env.DEV) {
            // method + url + status only — never request bodies (may contain passwords)
            console.warn("[api]", error.config?.method?.toUpperCase(), error.config?.url, status || error.code);
        }
        return Promise.reject(new ApiError(message, { status, data, original: error }));
    }
);

export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") =>
    (err && err.message) || fallback;

// Product images are stored by the backend as "/uploads/products/<file>" (relative) — make them absolute.
export const resolveAssetUrl = (url) => {
    if (!url) return "";
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    return `${API_BASE_URL}/${String(url).replace(/^\/+/, "")}`;
};

export default axiosInstance;
