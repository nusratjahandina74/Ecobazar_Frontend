import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, getMeApi, registerApi } from "../api/authApi";
import { tokenStorage, setUnauthorizedHandler } from "../api/axiosInstance";
import { normalizeUser } from "../utils/adapters";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
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
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        // Only a real 401/403 means "signed out". A slow / waking-up server (Render free tier), a 5xx or a
        // network blip must NOT delete the token - that was logging people out right after payment.
        (async () => {
            for (let attempt = 0; attempt < 4 && !cancelled; attempt += 1) {
                try {
                    const u = await getMeApi();
                    if (!cancelled) setUser(normalizeUser(u));
                    break;
                } catch (err) {
                    if (err.status === 401 || err.status === 403) { tokenStorage.clear(); break; }
                    if (attempt < 3) await sleep(2000 * (attempt + 1));
                }
            }
            if (!cancelled) setBooting(false);
        })();
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
