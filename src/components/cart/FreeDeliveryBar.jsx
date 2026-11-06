import { Truck } from "../common/Icons";
import { useSettings, quoteDelivery } from "../../context/SettingsContext";
import { formatBDT } from "../../utils/adapters";

/** "Add ৳X more for free delivery" progress bar. Only shows when the shop owner enabled free delivery above an amount. */
export default function FreeDeliveryBar({ subtotal }) {
    const { settings } = useSettings();
    const d = settings.delivery;
    if (d.freeAllActive) return <p className="flex items-center gap-2 text-sm text-leaf-dark bg-mint rounded-lg px-3 py-2"><Truck size={16} /> Free delivery on every order right now!</p>;
    if (!d.freeDeliveryEnabled || !(d.freeDeliveryThreshold > 0)) return null;
    const left = d.freeDeliveryThreshold - subtotal;
    const reached = quoteDelivery(d, "inside_dhaka", subtotal).free;
    const pct = Math.min(100, Math.round((subtotal / d.freeDeliveryThreshold) * 100));
    return (
        <div className="rounded-lg bg-mint px-3 py-3" role="status">
            <p className="flex items-center gap-2 text-sm text-forest"><Truck size={16} className="text-leaf" />{reached ? <b>You get free delivery!</b> : <>Add <b>{formatBDT(left)}</b> more for free delivery</>}</p>
            <div className="mt-2 h-2 rounded-full bg-forest/10 overflow-hidden" aria-hidden="true"><div className="h-full bg-leaf rounded-full" style={{ width: `${pct}%` }} /></div>
        </div>
    );
}
