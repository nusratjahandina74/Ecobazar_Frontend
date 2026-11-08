import { CreditCard, Check, Truck } from "../common/Icons";

const OPTIONS = [
    { value: "cod", title: "Cash on delivery", text: "Pay in cash when your order arrives.", icon: Truck, key: "codEnabled" },
    { value: "online", title: "Pay online with aamarPay", text: "Cards & mobile banking via the secure gateway.", icon: CreditCard, key: "onlineEnabled" },
];

export default function PaymentMethodSelector({ value, onChange, delivery }) {
    const options = OPTIONS.filter((o) => delivery?.[o.key] !== false);
    return (
        <div className="p-5 bg-white border rounded-xl border-forest/10 sm:p-6">
            <h2 className="mb-5 text-lg font-semibold font-display text-forest">Payment Method</h2>
            <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-3">
                {options.map(({ value: v, title, text, icon: Icon }) => {
                    const active = value === v;
                    return (
                        <button
                            key={v} type="button" role="radio" aria-checked={active} onClick={() => onChange(v)}
                            className={`flex items-center justify-between gap-3 p-3.5 sm:p-4 text-left rounded-lg border ${active ? "border-leaf bg-mint" : "border-forest/15 bg-white"}`}
                        >
                            <span className="flex items-center gap-3 min-w-0">
                                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-leaf text-white" : "bg-forest/5 text-forest/60"}`}><Icon size={16} /></span>
                                <span>
                                    <span className="block text-sm font-semibold text-forest">{title}</span>
                                    <span className="block text-xs text-slate">{text}</span>
                                </span>
                            </span>
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-leaf bg-leaf" : "border-forest/20"}`}>
                                {active && <Check size={12} className="text-white" strokeWidth={3} />}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
