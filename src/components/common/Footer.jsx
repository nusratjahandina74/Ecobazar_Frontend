import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, MapPin } from "../common/Icons";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./Icons";
import NewsletterBox from "./NewsletterBox";
import { getPages } from "../../api/publicApi";
import { ADMIN_LOGIN_URL } from "../../utils/constants";
import { useSettings } from "../../context/SettingsContext";

const ext = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

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
    const social = [["Facebook", s.facebook, FacebookIcon], ["Instagram", s.instagram, InstagramIcon], ["YouTube", s.youtube, YoutubeIcon]].filter(([, u]) => u);
    const link = "underline-offset-2";
    return (
        <footer className="bg-forest text-snow/80 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-display text-xl font-semibold text-snow">{name}</h3>
                        {s.tagline && <p className="text-sm text-snow/60 max-w-xs">{s.tagline}</p>}
                        <ul className="space-y-2 text-sm text-snow/70">
                            {s.phone && <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 shrink-0 text-leaf" /><a href={`tel:${s.phone}`}>{s.phone}</a></li>}
                            {s.email && <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 shrink-0 text-leaf" /><a href={`mailto:${s.email}`}>{s.email}</a></li>}
                            {s.address && <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-leaf" /><span>{s.address}</span></li>}
                        </ul>
                        {social.length > 0 && <div className="flex gap-3">{social.map(([label, url, Icon]) => <a key={label} href={ext(url)} target="_blank" rel="noreferrer" aria-label={label} className="w-9 h-9 rounded-full bg-snow/10 flex items-center justify-center"><Icon width={16} height={16} /></a>)}</div>}
                        {settings.home?.showNewsletter !== false && <NewsletterBox tone="dark" />}
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-snow mb-3">Shop</h4>
                        <ul className="space-y-2 text-sm text-snow/60">
                            <li><Link to="/products" className={link}>All products</Link></li>
                            <li><Link to="/cart" className={link}>Cart</Link></li>
                            <li><Link to="/my-orders" className={link}>My orders</Link></li>
                            <li><Link to="/track-order" className={link}>Track order</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-snow mb-3">Help</h4>
                        <ul className="space-y-2 text-sm text-snow/60">
                            <li><Link to="/contact" className={link}>Contact us</Link></li>
                            {pages.filter((p) => p.showInFooter).map((p) => <li key={p.slug}><Link to={`/page/${p.slug}`} className={link}>{p.title}</Link></li>)}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-snow mb-3">Account</h4>
                        <ul className="space-y-2 text-sm text-snow/60">
                            <li><Link to="/login" className={link}>Log in</Link></li>
                            <li><a href={ADMIN_LOGIN_URL} className={link}>Admin Login</a></li>
                            <li><Link to="/register" className={link}>Register</Link></li>
                            <li><Link to="/profile" className={link}>Profile</Link></li>
                            <li><Link to="/forgot-password" className={link}>Reset password</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-snow/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-snow/40">© {new Date().getFullYear()} {name}. All rights reserved.</p>
                    <p className="text-xs text-snow/40">Cash on delivery and online payment available</p>
                </div>
            </div>
        </footer>
    );
};
