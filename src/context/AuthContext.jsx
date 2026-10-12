import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, getMeApi, registerApi } from "../api/authApi";
import { tokenStorage, setUnauthorizedHandler } from "../api/axiosInstance";
import { normalizeUser } from "../utils/adapters";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // "booting" is true while a saved token is being validated against GET /me.
    // A stored token is never trusted on its own: the user (and role) always come from the server.
    const [booting, setBooting] = useState(() => !!tokenStorage.get());

    const logout = useCallback(() => {
        tokenStorage.clear();
        setUser(null);
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(logout);
        return () => setUnauthorizedHandler(null);
    }, [logout]);

    useEffect(() => {
        if (!tokenStorage.get()) return;
        let cancelled = false;
        getMeApi()
            .then((u) => { if (!cancelled) setUser(normalizeUser(u)); })
            .catch(() => { if (!cancelled) tokenStorage.clear(); }) // invalid/expired -> signed out
            .finally(() => { if (!cancelled) setBooting(false); });
        return () => { cancelled = true; };
    }, []);

    const login = useCallback(async (email, password) => {
        const data = await loginApi(email, password);
        if (!data.accessToken || !data.user) {
            throw new Error("Login succeeded but the server did not return a session. Is the backend up to date?");
        }
        tokenStorage.set(data.accessToken);
        const u = normalizeUser(data.user);
        setUser(u);
        return u;
    }, []);

    // The backend sends a verification e-mail and does not start a session on registration.
    const register = useCallback((payload) => registerApi(payload), []);

    const refreshUser = useCallback(async () => {
        const u = normalizeUser(await getMeApi());
        setUser(u);
        return u;
    }, []);

    const value = useMemo(
        () => ({ user, booting, isAuthenticated: !!user, login, register, logout, refreshUser, setUser }),
        [user, booting, login, register, logout, refreshUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
