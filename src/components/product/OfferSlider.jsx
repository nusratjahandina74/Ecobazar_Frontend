import { useRef } from "react";
import { ChevronLeft, ChevronRight, Zap } from "../common/Icons";
import OfferProductCard from "./OfferProductCard";

export default function OfferSlider({ products = [], title = "Today's Deals", subtitle }) {
    const scrollRef = useRef(null);
    if (!products.length) return null; // no discounted products -> section hidden (nothing is invented)

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;
        const amount = container.clientWidth * 0.8;
        container.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-end justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-leaf flex items-center justify-center shrink-0">
                        <Zap size={18} className="text-white" fill="white" />
                    </div>
                    <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-forest">{title}</h2>
                        {subtitle && <p className="text-sm text-slate mt-0.5">{subtitle}</p>}
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="w-9 h-9 rounded-full border border-forest/15 flex items-center justify-center text-forest/60 hover:bg-leaf hover:text-white hover:border-leaf transition-colors"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-9 h-9 rounded-full border border-forest/15 flex items-center justify-center text-forest/60 hover:bg-leaf hover:text-white hover:border-leaf transition-colors"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {products.map((product) => (
                    <div key={product._id} className="snap-start">
                        <OfferProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
