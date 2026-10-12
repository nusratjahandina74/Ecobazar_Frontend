import InputField from "../common/InputField";
import { MapPin, Phone, User, Mail } from "../common/Icons";

// Field names mirror what POST /payment expects (cus_name, cus_email, cus_add1, ...).
export default function AddressForm({ form, errors, onChange }) {
    return (
        <div className="bg-white rounded-xl border border-forest/10 p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-forest mb-5">Shipping Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full name" name="cus_name" icon={User} value={form.cus_name} onChange={onChange} error={errors.cus_name} placeholder="Jane Doe" autoComplete="name" />
                <InputField label="Email" name="cus_email" type="email" icon={Mail} value={form.cus_email} onChange={onChange} error={errors.cus_email} placeholder="you@example.com" autoComplete="email" />
                <InputField label="Phone number" name="cus_phone" icon={Phone} value={form.cus_phone} onChange={onChange} error={errors.cus_phone} placeholder="01XXXXXXXXX" autoComplete="tel" />

                <div className="sm:col-span-2">
                    <InputField label="Street address" name="cus_add1" icon={MapPin} value={form.cus_add1} onChange={onChange} error={errors.cus_add1} placeholder="House, road, area" autoComplete="address-line1" />
                </div>
                <div className="sm:col-span-2">
                    <InputField label="Address line 2 (optional)" name="cus_add2" value={form.cus_add2} onChange={onChange} error={errors.cus_add2} placeholder="Apartment, landmark, etc." autoComplete="address-line2" />
                </div>

                <InputField label="City" name="cus_city" value={form.cus_city} onChange={onChange} error={errors.cus_city} placeholder="Dhaka" autoComplete="address-level2" />
                <InputField label="State / Division (optional)" name="cus_state" value={form.cus_state} onChange={onChange} error={errors.cus_state} placeholder="Dhaka" autoComplete="address-level1" />
                <InputField label="Postal code" name="cus_postcode" value={form.cus_postcode} onChange={onChange} error={errors.cus_postcode} placeholder="1207" autoComplete="postal-code" />
            </div>
        </div>
    );
}
