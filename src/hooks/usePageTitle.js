import { useEffect } from "react";
import { useSettings } from "../context/SettingsContext";

/** Sets the browser tab title and meta description (defaults come from Dashboard -> Settings -> Brand & SEO). */
export default function usePageTitle(title, description) {
    const { settings } = useSettings();
    const store = settings.store?.name || "EcoBazaar";
    useEffect(() => {
        document.title = title ? `${title} | ${store}` : settings.seo?.title || store;
        const desc = description || settings.seo?.description || "";
        let m = document.querySelector('meta[name="description"]');
        if (!m) { m = document.createElement("meta"); m.name = "description"; document.head.appendChild(m); }
        m.content = desc;
    }, [title, description, store, settings.seo?.title, settings.seo?.description]);
}
