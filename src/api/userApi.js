import api from "./axiosInstance";
import { normalizeUser } from "../utils/adapters";

// GET /allusers -> { data } (admin only)
export const getUsers = () => api.get("/allusers").then((r) => (r.data.data || []).map(normalizeUser));

// GET /singleuser/:id -> { data }
export const getUser = (id) => api.get(`/singleuser/${id}`).then((r) => normalizeUser(r.data.data));

// POST /updateuser/:id (JSON)
export const updateUser = (id, payload) => api.post(`/updateuser/${id}`, payload).then((r) => normalizeUser(r.data.data));

// DELETE /deleteuser/:id (admin only)
export const deleteUser = (id) => api.delete(`/deleteuser/${id}`).then((r) => r.data);
