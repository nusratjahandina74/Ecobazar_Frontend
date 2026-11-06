import { useSettings } from "../../context/SettingsContext";

// Scrolling announcement controlled from Dashboard -> Settings -> Notice
export default function NoticeBar() {
    const { settings } = useSettings();
    const n = settings.notice;
    if (!n?.isActive || !n.text) return null;
    return (
        <div className="bg-leaf text-white text-sm overflow-hidden" role="status">
            <div className="max-w-7xl mx-auto px-4 py-1.5">
                <style>{`@keyframes eb-marquee{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
.eb-marquee{display:inline-block;white-space:nowrap;animation:eb-marquee 22s linear infinite}
@media (prefers-reduced-motion:reduce){.eb-marquee{animation:none;white-space:normal}}`}</style>
                <p className="eb-marquee">{n.text}</p>
            </div>
        </div>
    );
}
