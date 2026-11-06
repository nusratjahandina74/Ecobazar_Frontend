import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
    if (!products.length) {
        return (
            <div className="text-center py-20">
                <p className="text-slate">No products found.</p>
                <p className="text-sm text-slate/60 mt-1">Try adjusting your filters or search term.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};