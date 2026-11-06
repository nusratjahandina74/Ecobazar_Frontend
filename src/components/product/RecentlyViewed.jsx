import { useMemo } from "react";
import ProductCard from "./ProductCard";
import { useCatalog } from "../../context/CatalogContext";
import { getRecent } from "../../utils/recent";

export default function RecentlyViewed({ excludeId }) {
    const { activeProducts } = useCatalog();
    const items = useMemo(() => {
        const byId = new Map(activeProducts.map((p) => [p._id, p]));
        return getRecent().filter((id) => id !== excludeId).map((id) => byId.get(id)).filter(Boolean).slice(0, 4);
    }, [activeProducts, excludeId]);
    if (!items.length) return null;
    return (
        <section className="mt-14 pt-10 border-t border-forest/10">
            <h2 className="font-display text-xl font-semibold text-forest mb-5">Recently viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">{items.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        </section>
    );
}
