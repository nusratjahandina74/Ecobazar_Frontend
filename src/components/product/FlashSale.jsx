import { Link } from "react-router";
import { ArrowRight, Flame } from "../common/Icons";
import ProductCard from "./ProductCard";
import useCountdown from "../../hooks/useCountdown";

const Unit = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="min-w-[3.25rem] sm:min-w-[4rem] rounded-lg bg-white text-forest font-display text-2xl sm:text-3xl font-semibold tabular-nums text-center py-2 leading-none">{String(value).padStart(2, "0")}</span>
        <span className="text-[11px] text-white/70 mt-1.5">{label}</span>
    </div>
);

/** Flash-sale band with a live countdown. Set up in Dashboard -> Settings -> Home page. Hides itself when time is up. */
export default function FlashSale({ flash, products }) {
    const t = useCountdown(flash?.endsAt);
    if (!flash?.enabled || t.done || !products.length) return null;
    return (
        <section aria-label={flash.title || "Flash sale"} className="bg-forest">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-7">
                    <div>
                        <p className="inline-flex items-center gap-1.5 text-leaf-soft text-sm font-semibold"><Flame size={16} /> Limited time</p>
                        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-1">{flash.title || "Flash sale"}</h2>
                        {flash.subtitle && <p className="text-white/70 text-sm mt-1.5">{flash.subtitle}</p>}
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3" role="timer" aria-label="Time left">
                        {t.days > 0 && <Unit value={t.days} label="days" />}
                        <Unit value={t.hours} label="hours" /><Unit value={t.minutes} label="min" /><Unit value={t.seconds} label="sec" />
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                <div className="mt-6 text-center sm:text-right">
                    <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-white underline underline-offset-4">See all products <ArrowRight size={14} /></Link>
                </div>
            </div>
        </section>
    );
}
