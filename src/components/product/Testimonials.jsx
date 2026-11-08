import { useEffect, useState } from "react";
import { getTestimonials } from "../../api/publicApi";
import { Stars } from "../common/Stars";

/** Real reviews (4-5 stars, approved in the dashboard). Renders nothing until there are some. */
export default function Testimonials() {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const c = new AbortController();
        getTestimonials({ signal: c.signal }).then(setItems).catch(() => { /* optional section */ });
        return () => c.abort();
    }, []);
    if (!items.length) return null;
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-forest">What customers say</h2>
            <p className="text-sm text-slate mt-1 mb-6">Reviews from people who received their orders</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.slice(0, 6).map((r) => (
                    <figure key={r._id} className="rounded-xl border border-forest/10 bg-white p-5 flex flex-col gap-3">
                        <Stars value={r.rating} size={16} />
                        <blockquote className="text-sm text-forest leading-relaxed line-clamp-5">“{r.comment}”</blockquote>
                        <figcaption className="mt-auto text-xs text-slate"><b className="text-forest">{r.name}</b>{r.product ? ` on ${r.product}` : ""}{r.verified ? " · Verified buyer" : ""}</figcaption>
                    </figure>))}
            </div>
        </section>
    );
}
