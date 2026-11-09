import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, MapPin } from "../common/Icons";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./Icons";
import NewsletterBox from "./NewsletterBox";
import { getPages } from "../../api/publicApi";
import { ADMIN_LOGIN_URL } from "../../utils/constants";
import { useSettings } from "../../context/SettingsContext";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

// EcoBazaar WhatsApp. Dashboard settings (settings.store.whatsapp) can override it.
const DEFAULT_WHATSAPP = "01306409484";
const WHATSAPP_GREEN = "#25D366";

const ext = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

// 01306409484 -> 8801306409484 (Bangladesh country code) for wa.me links
const waDigits = (n) => {
    const d = String(n || "").replace(/\D/g, "");
    if (d.startsWith("880")) return d;
    if (d.startsWith("0")) return `880${d.slice(1)}`;
    return d;
};

/* ------------------------------------------------------------------ */
/*  Small inline icons (no extra dependency needed)                    */
/* ------------------------------------------------------------------ */

const Svg = ({ size = 20, children, ...rest }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>{children}</svg>
);

const WhatsAppIcon = ({ size = 20, ...rest }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
);

const TruckIcon = (p) => <Svg {...p}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></Svg>;
const WalletIcon = (p) => <Svg {...p}><path d="M3 7a2 2 0 0 1 2-2h13v4" /><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Z" /><circle cx="16.5" cy="14.5" r="1.1" /></Svg>;
const ReturnIcon = (p) => <Svg {...p}><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></Svg>;
const PinSearchIcon = (p) => <Svg {...p}><path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" /><circle cx="12" cy="11" r="2.2" /></Svg>;
const ArrowUpIcon = (p) => <Svg {...p}><path d="M12 19V5M5 12l7-7 7 7" /></Svg>;

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

const linkCls = "inline-block py-1 text-snow/60 hover:text-snow underline-offset-4 hover:underline transition-colors";

const ColumnTitle = ({ children }) => (
    <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-snow mb-4">{children}</h4>
);

// A pill-style support card, like a "tap to contact" row
function SupportCard({ href, icon, label, value, accent, external, badge }) {
    const Tag = href ? "a" : "div";
    const props = href ? { href, ...(external ? { target: "_blank", rel: "noreferrer" } : {}) } : {};
    return (
        <Tag {...props} className="group flex items-center gap-3 rounded-2xl border border-snow/10 bg-snow/5 p-3.5 transition hover:bg-snow/10 hover:border-snow/20 min-w-0">
            <span className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center" style={accent ? { backgroundColor: `${accent}26`, color: accent } : undefined}>
                {icon}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-xs text-snow/50">{label}</span>
                <span className="block text-base font-semibold text-snow [overflow-wrap:anywhere]">{value}</span>
            </span>
            {badge && (
                <span className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white transition group-hover:brightness-110" style={{ backgroundColor: accent }}>{badge}</span>
            )}
        </Tag>
    );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export default function Footer() {
    const { settings } = useSettings();
    const s = settings.store || {};
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const c = new AbortController();
        getPages({ signal: c.signal }).then(setPages).catch(() => { /* footer still works without page links */ });
        return () => c.abort();
    }, []);

    const name = s.name || "EcoBazaar";
    const whatsapp = s.whatsapp || DEFAULT_WHATSAPP;
    const waLink = `https://wa.me/${waDigits(whatsapp)}?text=${encodeURIComponent(`Hello ${name}, I need some help.`)}`;

    const social = [
        ["Facebook", s.facebook ? ext(s.facebook) : null, FacebookIcon, null],
        ["Instagram", s.instagram ? ext(s.instagram) : null, InstagramIcon, null],
        ["YouTube", s.youtube ? ext(s.youtube) : null, YoutubeIcon, null],
        ["WhatsApp", waLink, WhatsAppIcon, WHATSAPP_GREEN],
    ].filter(([, url]) => url);

    const perks = [
        [TruckIcon, "Cash on delivery", "Pay when your order arrives"],
        [WalletIcon, "Easy payment", "bKash, Nagad, Rocket & online"],
        [ReturnIcon, "Simple returns", "Request a return from My orders"],
        [PinSearchIcon, "Track your order", "Know where your parcel is"],
    ];

    const footerPages = pages.filter((p) => p.showInFooter);

    return (
        <footer className="bg-forest text-snow/80 mt-12 sm:mt-20">
            {/* ---------- Trust strip ---------- */}
            <div className="border-b border-snow/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {perks.map(([Icon, title, text]) => (
                        <div key={title} className="flex items-center gap-3 min-w-0">
                            <span className="w-11 h-11 shrink-0 rounded-xl bg-snow/10 text-leaf flex items-center justify-center"><Icon size={22} /></span>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-snow">{title}</p>
                                <p className="text-xs text-snow/50">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- Main ---------- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

                    {/* Stay connected (first on mobile, last on desktop) */}
                    <div className="order-first lg:order-last lg:col-span-3 space-y-5 min-w-0">
                        <ColumnTitle>Stay connected</ColumnTitle>
                        <div>
                            <h3 className="font-display text-xl font-semibold text-snow">{name}</h3>
                            {s.tagline && <p className="mt-1 text-sm text-snow/60 max-w-xs">{s.tagline}</p>}
                        </div>
                        {settings.home?.showNewsletter !== false && <NewsletterBox tone="dark" />}
                        <div className="flex flex-wrap gap-3">
                            {social.map(([label, url, Icon, color]) => (
                                <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label}
                                    className="w-11 h-11 rounded-full bg-snow/10 flex items-center justify-center transition hover:-translate-y-0.5 hover:bg-snow/20"
                                    style={color ? { color } : undefined}>
                                    <Icon width={18} height={18} size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Support */}
                    <div className="lg:col-span-4 min-w-0">
                        <ColumnTitle>Support</ColumnTitle>
                        <div className="space-y-3">
                            <SupportCard
                                href={waLink} external accent={WHATSAPP_GREEN}
                                icon={<WhatsAppIcon size={22} />}
                                label="WhatsApp · chat with us"
                                value={whatsapp}
                                badge="Chat"
                            />
                            {s.phone && (
                                <SupportCard href={`tel:${s.phone}`} accent="#34d399" icon={<Phone size={20} />} label={s.hours ? `Call · ${s.hours}` : "Call us"} value={s.phone} />
                            )}
                            {s.email && (
                                <SupportCard href={`mailto:${s.email}`} accent="#34d399" icon={<Mail size={20} />} label="Email" value={s.email} />
                            )}
                            {s.address && (
                                <SupportCard accent="#34d399" icon={<MapPin size={20} />} label="Store address" value={s.address} />
                            )}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8 min-w-0">
                        <div>
                            <ColumnTitle>Shop</ColumnTitle>
                            <ul className="space-y-1 text-sm">
                                <li><Link to="/products" className={linkCls}>All products</Link></li>
                                <li><Link to="/cart" className={linkCls}>Cart</Link></li>
                                <li><Link to="/my-orders" className={linkCls}>My orders</Link></li>
                                <li><Link to="/track-order" className={linkCls}>Track order</Link></li>
                            </ul>
                        </div>

                        <div>
                            <ColumnTitle>Help</ColumnTitle>
                            <ul className="space-y-1 text-sm">
                                <li><Link to="/contact" className={linkCls}>Contact us</Link></li>
                                {footerPages.map((p) => <li key={p.slug}><Link to={`/page/${p.slug}`} className={linkCls}>{p.title}</Link></li>)}
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <ColumnTitle>Account</ColumnTitle>
                            <ul className="space-y-1 text-sm">
                                <li><Link to="/login" className={linkCls}>Log in</Link></li>
                                <li><Link to="/register" className={linkCls}>Register</Link></li>
                                <li><Link to="/profile" className={linkCls}>Profile</Link></li>
                                <li><Link to="/forgot-password" className={linkCls}>Reset password</Link></li>
                                <li><a href={ADMIN_LOGIN_URL} className={linkCls}>Admin login</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- Bottom bar ---------- */}
            <div className="border-t border-snow/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
                    <p className="text-xs text-snow/40">© {new Date().getFullYear()} {name}. All rights reserved.</p>

                    <ul className="flex flex-wrap items-center justify-center gap-2" aria-label="Accepted payment methods">
                        {["Cash on delivery", "bKash", "Nagad", "Rocket", "Online payment"].map((m) => (
                            <li key={m} className="rounded-full border border-snow/15 px-3 py-1 text-[11px] text-snow/60">{m}</li>
                        ))}
                    </ul>

                    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="inline-flex items-center gap-2 rounded-full bg-snow/10 hover:bg-snow/20 transition px-4 py-2 text-xs font-medium text-snow">
                        Back to top <ArrowUpIcon size={14} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
