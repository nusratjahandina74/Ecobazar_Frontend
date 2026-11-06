import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getBanners } from "../../api/publicApi";

// Banners managed from Dashboard -> Banners. Renders nothing if none are active.
export default function BannerSlider() {
    const [banners, setBanners] = useState([]);
    const [i, setI] = useState(0);

    useEffect(() => {
        const c = new AbortController();
        getBanners({ signal: c.signal }).then(setBanners).catch(() => { });
        return () => c.abort();
    }, []);

    useEffect(() => {
        if (banners.length < 2) return undefined;
        const t = setInterval(() => setI((n) => (n + 1) % banners.length), 5000);
        return () => clearInterval(t);
    }, [banners.length]);

    if (!banners.length) return null;
    const b = banners[i % banners.length];
    const inner = (
        <div className="relative w-full aspect-[16/6] sm:aspect-[16/5] overflow-hidden rounded-2xl bg-mint">
            <img src={b.image} alt={b.title || "Banner"} className="absolute inset-0 w-full h-full object-cover" />
            {(b.title || b.subtitle || b.buttonText) && (
                <div className="absolute inset-0 bg-gradient-to-r from-forest/70 to-transparent flex flex-col justify-center px-6 sm:px-12 text-white">
                    {b.title && <h2 className="font-display text-xl sm:text-4xl font-semibold max-w-lg">{b.title}</h2>}
                    {b.subtitle && <p className="text-sm sm:text-base mt-2 max-w-md text-white/90">{b.subtitle}</p>}
                    {b.buttonText && <span className="mt-4 w-fit px-5 py-2 rounded-lg bg-white text-forest text-sm font-semibold">{b.buttonText}</span>}
                </div>
            )}
        </div>
    );
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6" aria-label="Promotions">
            {b.link ? (/^https?:/i.test(b.link) ? <a href={b.link} target="_blank" rel="noreferrer">{inner}</a> : <Link to={b.link}>{inner}</Link>) : inner}
            {banners.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                    {banners.map((x, n) => (
                        <button key={x._id} onClick={() => setI(n)} aria-label={`Banner ${n + 1}`} className={`h-2 rounded-full ${n === i % banners.length ? "w-6 bg-leaf" : "w-2 bg-forest/20"}`} />
                    ))}
                </div>
            )}
        </section>
    );
}
