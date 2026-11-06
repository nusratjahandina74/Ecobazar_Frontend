import { DELIVERY_ZONES } from "../../utils/constants";
import { formatBDT } from "../../utils/adapters";
import { quoteDelivery } from "../../context/SettingsContext";

// Dropdown: Inside Dhaka / Outside Dhaka (charges come from Dashboard -> Settings -> Delivery)
export default function DeliveryZoneSelect({ value, onChange, delivery, subtotal }) {
    return (
        <div className="p-5 bg-white border rounded-xl border-forest/10 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold font-display text-forest">Delivery Area</h2>
            <label htmlFor="deliveryZone" className="block mb-1.5 text-sm font-medium text-forest">Where should we deliver?</label>
            <select
                id="deliveryZone" name="deliveryZone" value={value} onChange={(e) => onChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg border-forest/15 focus:outline-none focus:ring-4 focus:ring-leaf/15 focus:border-leaf"
            >
                {DELIVERY_ZONES.map((z) => {
                    const q = quoteDelivery(delivery, z.value, subtotal);
                    return <option key={z.value} value={z.value}>{z.label} - {q.free ? "Free delivery" : formatBDT(q.charge)}</option>;
                })}
            </select>
            {delivery.freeDeliveryEnabled && delivery.freeDeliveryThreshold > 0 && !delivery.freeAllActive && (
                <p className="mt-2 text-xs text-slate">Free delivery on orders of {formatBDT(delivery.freeDeliveryThreshold)} or more.</p>
            )}
        </div>
    );
}
