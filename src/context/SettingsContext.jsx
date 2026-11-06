import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getPublicSettings } from "../api/publicApi";

const DEFAULTS = {
    store: { name: "EcoBazaar" },
    notice: { text: "", isActive: false },
    whatsapp: { phone: "", isActive: false },
    home: { showCategories: true, showFeatured: true, showNewArrivals: true, showBestSellers: true, showTestimonials: true, showNewsletter: true, flash: { enabled: false, productIds: [] }, badges: [] },
    seo: { title: "", description: "" },
    theme: { primary: "" },
    reviews: { enabled: true },
    delivery: { insideDhakaCharge: 80, outsideDhakaCharge: 120, freeDeliveryEnabled: false, freeDeliveryThreshold: 0, freeAllActive: false, codEnabled: true, onlineEnabled: true },
};

const SettingsContext = createContext({ settings: DEFAULTS, loaded: false });

// Store info, notice, WhatsApp number and delivery charges are edited in the admin dashboard.
export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULTS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        getPublicSettings({ signal: controller.signal })
            .then((s) => setSettings({ ...DEFAULTS, ...s, home: { ...DEFAULTS.home, ...s.home }, delivery: { ...DEFAULTS.delivery, ...s.delivery } }))
            .catch(() => { /* keep defaults: the shop must still work if this call fails */ })
            .finally(() => setLoaded(true));
        return () => controller.abort();
    }, []);

    // Brand colour chosen in the dashboard overrides the theme tokens (Tailwind reads these CSS variables)
    useEffect(() => {
        const root = document.documentElement.style;
        const c = settings.theme?.primary;
        if (/^#[0-9a-fA-F]{6}$/.test(c || "")) {
            root.setProperty("--color-leaf", c);
            root.setProperty("--color-leaf-dark", shade(c, -0.18));
            root.setProperty("--color-leaf-soft", shade(c, 0.55));
            root.setProperty("--color-forest", shade(c, -0.7));
            root.setProperty("--color-mint", shade(c, 0.93));
        } else ["--color-leaf", "--color-leaf-dark", "--color-leaf-soft", "--color-forest", "--color-mint"].forEach((k) => root.removeProperty(k));
    }, [settings.theme?.primary]);

    const value = useMemo(() => ({ settings, loaded }), [settings, loaded]);
    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);

/** Same rule the server applies (the server's number is the one that is charged). */
export function quoteDelivery(delivery, zone, subtotal) {
    const base = zone === "outside_dhaka" ? delivery.outsideDhakaCharge : delivery.insideDhakaCharge;
    if (delivery.freeAllActive) return { charge: 0, base, free: true };
    if (delivery.freeDeliveryEnabled && delivery.freeDeliveryThreshold > 0 && subtotal >= delivery.freeDeliveryThreshold) return { charge: 0, base, free: true };
    return { charge: base, base, free: false };
}

/** Lighten (amount > 0) or darken (amount < 0) a #rrggbb colour. */
function shade(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(amount < 0 ? v * (1 + amount) : v + (255 - v) * amount));
    return `#${ch.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}
