import { Link } from "react-router";
import { ArrowRight } from "../common/Icons";

/** Home page category tiles with the images uploaded in Dashboard -> Categories. */
export default function CategoryTiles({ categories }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c) => {
                const Icon = c.icon;
                return (
                    <Link key={c.name} to={`/products?category=${encodeURIComponent(c.name)}`} className="group flex flex-col rounded-xl border border-forest/10 bg-white overflow-hidden">
                        <div className="aspect-square bg-mint flex items-center justify-center overflow-hidden">
                            {c.image ? <img src={c.image} alt="" loading="lazy" className="w-full h-full object-cover" /> : <Icon size={34} className="text-leaf/70" />}
                        </div>
                        <div className="p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0"><p className="text-sm font-semibold text-forest truncate">{c.name}</p>{c.count > 0 && <p className="text-xs text-slate">{c.count} items</p>}</div>
                            <ArrowRight size={14} className="text-leaf shrink-0" />
                        </div>
                    </Link>);
            })}
        </div>
    );
}
