import { CreditCard, Check } from "../common/Icons";

// The backend initialises exactly one payment flow (aamarPay gateway). No cash-on-delivery is offered.
export default function PaymentMethodSelector() {
    return (
        <div className="p-5 bg-white border rounded-xl border-forest/10 sm:p-6">
            <h2 className="mb-5 text-lg font-semibold font-display text-forest">Payment Method</h2>

            <div className="flex items-center justify-between p-4 rounded-lg border border-leaf bg-mint">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-leaf text-white">
                        <CreditCard size={16} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-forest">Pay online with aamarPay</p>
                        <p className="text-xs text-slate">Cards & mobile banking. You'll be redirected to the secure gateway.</p>
                    </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-leaf bg-leaf flex items-center justify-center shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                </div>
            </div>
        </div>
    );
}
