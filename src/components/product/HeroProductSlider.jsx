import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight } from "../common/Icons";
import { ProductImage } from "./ProductCard";
import { formatBDT } from "../../utils/adapters";

export default function HeroProductSlider({ products = [] }) {
    const [active, setActive] = useState(0);
    const count = products.length;

    useEffect(() => {
        if (count < 2) return;
        const timer = setInterval(() => setActive((prev) => (prev + 1) % count), 4000);
        return () => clearInterval(timer);
    }, [count]);

    if (!count) return null;
    const product = products[active % count];

    return (
        <div className="relative w-full max-w-md mx-auto">
            <div className="absolute -inset-6 bg-white/10 rounded-full blur-3xl" />

            <div className="relative bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
                <Link to={`/products/${product._id}`} className="block">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-white/10">
                        <ProductImage
                            key={product._id}
                            src={product.mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                        {product.discountPercent > 0 && (
                            <span className="absolute top-3 left-3 bg-white text-leaf-dark text-xs font-bold px-2.5 py-1 rounded-full">
                                -{product.discountPercent}%
                            </span>
                        )}
                    </div>
                </Link>

                <div className="flex items-center justify-between mt-4 gap-3">
                    <div className="min-w-0">
                        <p className="text-white text-sm font-semibold line-clamp-1">{product.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="font-display text-lg font-semibold text-white">{formatBDT(product.salePrice)}</span>
                            {product.hasDiscount && (
                                <span className="text-xs text-white/60 line-through">{formatBDT(product.price)}</span>
                            )}
                        </div>
                    </div>
                    <Link
                        to={`/products/${product._id}`}
                        className="shrink-0 w-10 h-10 rounded-full bg-white text-leaf-dark flex items-center justify-center hover:bg-forest hover:text-white transition-colors"
                        aria-label={`View ${product.title}`}
                    >
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {count > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-5">
                        {products.map((p, i) => (
                            <button
                                key={p._id}
                                onClick={() => setActive(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
                                aria-label={`Show product ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
