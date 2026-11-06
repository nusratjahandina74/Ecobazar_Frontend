import { MessageCircle } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function WhatsAppButton() {
    const { settings } = useSettings();
    const w = settings.whatsapp;
    if (!w?.isActive || !w.phone) return null;
    const digits = String(w.phone).replace(/[^\d]/g, "").replace(/^0/, "880");
    return (
        <a
            href={`https://wa.me/${digits}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed z-40 bottom-24 lg:bottom-5 right-5 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center"
        >
            <MessageCircle size={26} />
        </a>
    );
}
