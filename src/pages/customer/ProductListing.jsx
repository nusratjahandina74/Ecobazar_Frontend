import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal } from "../../components/common/Icons";
import ProductGrid from "../../components/product/ProductGrid";
import Pagination from "../../components/common/Pagination";
import PriceRangeSlider from "../../components/product/PriceRangeSlider";
import MobileFilterDrawer from "../../components/product/MobileFilterDrawer";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateViews";
import { useCatalog } from "../../context/CatalogContext";

const PER_PAGE = 12;
const STEP = 100;

export default function ProductListing() {
    const { activeProducts, categories, loading, error, reload } = useCatalog();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category") || "";
    const subParam = searchParams.get("sub") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // price bounds come from the real products
    const priceCeil = useMemo(() => {
        const top = activeProducts.reduce((m, p) => Math.max(m, p.salePrice), 0);
        return Math.max(STEP, Math.ceil(top / STEP) * STEP);
    }, [activeProducts]);
    const priceFloor = 0;

    const priceRange = [
        minPrice !== null ? Number(minPrice) : priceFloor,
        maxPrice !== null ? Number(maxPrice) : priceCeil,
    ];

    const activeCategory = categories.find((c) => c.name === categoryParam);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        let result = activeProducts.filter((p) => {
            if (term && !`${p.title} ${p.category} ${p.subCategory} ${p.tags.join(" ")}`.toLowerCase().includes(term)) return false;
            if (categoryParam && p.category.toLowerCase() !== categoryParam.toLowerCase()) return false;
            if (subParam && p.subCategory.toLowerCase() !== subParam.toLowerCase()) return false;
            return p.salePrice >= priceRange[0] && p.salePrice <= priceRange[1];
        });

        result = [...result];
        if (sort === "newest") result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        if (sort === "price-low") result.sort((a, b) => a.salePrice - b.salePrice);
        if (sort === "price-high") result.sort((a, b) => b.salePrice - a.salePrice);
        if (sort === "name") result.sort((a, b) => a.title.localeCompare(b.title));
        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeProducts, search, categoryParam, subParam, sort, priceRange[0], priceRange[1]]);

    useEffect(() => setPage(1), [search, categoryParam, subParam, sort, minPrice, maxPrice]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const setCategory = (catName) => {
        const next = new URLSearchParams(searchParams);
        if (catName) next.set("category", catName);
        else next.delete("category");
        next.delete("sub");
        setSearchParams(next);
    };

    const setSub = (sub) => {
        const next = new URLSearchParams(searchParams);
        if (sub && sub !== subParam) next.set("sub", sub);
        else next.delete("sub");
        setSearchParams(next);
    };

    const handlePriceChange = (range) => {
        const next = new URLSearchParams(searchParams);
        next.set("minPrice", range[0]);
        next.set("maxPrice", range[1]);
        setSearchParams(next);
    };

    const catBtn = (active) =>
        `text-left text-sm px-3 py-2 rounded-lg transition-colors ${active ? "bg-leaf text-white" : "text-forest/70 hover:bg-mint hover:text-leaf"}`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
                <div>
                    <h1 className="font-display text-3xl font-semibold text-forest">
                        {subParam || categoryParam || (search ? `Results for "${search}"` : "All Products")}
                    </h1>
                    <p className="text-sm text-slate mt-1">{loading ? "Loading…" : `${filtered.length} products found`}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="lg:hidden flex items-center gap-1.5 text-sm font-medium border border-forest/15 rounded-lg px-3 py-2 hover:border-leaf hover:text-leaf transition-colors"
                    >
                        <SlidersHorizontal size={15} /> Filters
                    </button>

                    <label className="sr-only" htmlFor="sort">Sort products</label>
                    <select
                        id="sort"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="text-sm border border-forest/15 rounded-lg px-3 py-2 bg-white hover:border-leaf/60 focus:outline-none focus:ring-2 focus:ring-leaf/20 focus:border-leaf"
                    >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name: A–Z</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-8">
                <aside className="hidden lg:flex lg:flex-col gap-5 w-56 shrink-0">
                    <div>
                        <h3 className="text-sm font-semibold text-forest mb-3">Category</h3>
                        <div className="flex flex-col gap-1">
                            <button onClick={() => setCategory("")} className={catBtn(!categoryParam)}>All Categories</button>

                            <div className="pt-3">
                                <PriceRangeSlider min={priceFloor} max={priceCeil} value={priceRange} onChange={handlePriceChange} step={STEP} />
                            </div>

                            <div className="pt-3 flex flex-col gap-1">
                                {categories.map((cat) => (
                                    <button key={cat.name} onClick={() => setCategory(cat.name)} className={catBtn(categoryParam === cat.name)}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {activeCategory && activeCategory.subcategories.length > 0 && (
                        <div className="pt-5 border-t border-forest/10">
                            <h3 className="text-sm font-semibold text-forest mb-3">{activeCategory.name} — Refine</h3>
                            <div className="flex flex-col gap-1">
                                {activeCategory.subcategories.map((sub) => (
                                    <button
                                        key={sub}
                                        onClick={() => setSub(sub)}
                                        className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${subParam === sub ? "bg-leaf text-white font-medium" : "text-slate hover:bg-mint hover:text-leaf"}`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                <div className="flex-1 min-w-0">
                    {loading && <PageLoader />}
                    {!loading && error && <ErrorState message={error} onRetry={reload} />}
                    {!loading && !error && (
                        <>
                            <ProductGrid products={paginated} />
                            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                        </>
                    )}
                </div>
            </div>

            <MobileFilterDrawer
                open={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                categories={categories}
                categoryParam={categoryParam}
                setCategory={setCategory}
                activeCategory={activeCategory}
                subParam={subParam}
                setSub={setSub}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                priceFloor={priceFloor}
                priceCeil={priceCeil}
            />
        </div>
    );
}
