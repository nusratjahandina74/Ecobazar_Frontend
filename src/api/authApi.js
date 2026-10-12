import api from "./axiosInstance";

// POST /registration  { email, password, confirmPassword, terms }
export const registerApi = (payload) => api.post("/registration", payload).then((r) => r.data);

// POST /login -> { success, message, accessToken, user }
export const loginApi = (email, password) => api.post("/login", { email, password }).then((r) => r.data);

// GET /me (added to the backend) -> { user }
export const getMeApi = () => api.get("/me").then((r) => r.data.user);

// POST /forgetpassword { email }   (backend spelling: "forget")
export const forgotPasswordApi = (email) => api.post("/forgetpassword", { email }).then((r) => r.data);

// POST /resetpassword/:token { newPassword, confirmPassword }
export const resetPasswordApi = (token, newPassword, confirmPassword) =>
    api.post(`/resetpassword/${encodeURIComponent(token)}`, { newPassword, confirmPassword }).then((r) => r.data);

// POST /resendverificationemail { email }
export const resendVerificationApi = (email) => api.post("/resendverificationemail", { email }).then((r) => r.data);

// POST /verifyemail/:token
export const verifyEmailApi = (token) => api.post(`/verifyemail/${encodeURIComponent(token)}`).then((r) => r.data);
