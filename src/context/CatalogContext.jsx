import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/productApi";
import { buildCategories } from "../utils/categories";

const CatalogContext = createContext(null);
export function CatalogProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        setLoading(true);
        setError("");
        getProducts({ signal: controller.signal })
            .then((list) => { if (active) setProducts(list); })
            .catch((err) => {
                if (active && err?.original?.code !== "ERR_CANCELED") setError(err.message);
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; controller.abort(); };
    }, [tick]);

    const reload = useCallback(() => setTick((t) => t + 1), []);

    // customers only ever see "active" products
    const activeProducts = useMemo(() => products.filter((p) => p.status === "active"), [products]);
    const categories = useMemo(() => buildCategories(activeProducts), [activeProducts]);

    const value = useMemo(
        () => ({ products, activeProducts, categories, loading, error, reload }),
        [products, activeProducts, categories, loading, error, reload]
    );
    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
    const ctx = useContext(CatalogContext);
    if (!ctx) throw new Error("useCatalog must be used within a CatalogProvider");
    return ctx;
}
