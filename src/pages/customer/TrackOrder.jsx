import { useState } from "react";
import { useSearchParams } from "react-router";
import { Check, Package, Truck, Clock, X } from "../../components/common/Icons";
import { trackOrder } from "../../api/publicApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { formatBDT } from "../../utils/adapters";
import usePageTitle from "../../hooks/usePageTitle";

const STEPS = [
    { key: "Order Placed", label: "Order placed", icon: Clock },
    { key: "Processing", label: "Processing", icon: Package },
    { key: "Shipped", label: "On the way", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: Check },
];
const dt = (d) => new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });

export default function TrackOrder() {
    usePageTitle("Track your order", "Check where your order is using your order number and phone number.");
    const [params] = useSearchParams();
    const [orderNumber, setOrderNumber] = useState(params.get("order") || ""); const [phone, setPhone] = useState("");
    const [state, setState] = useState({ busy: false, err: "", order: null });
    const submit = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim() || phone.replace(/\D/g, "").length < 10) return setState({ busy: false, err: "Enter your order number and the phone number you used.", order: null });
        setState({ busy: true, err: "", order: null });
        try { setState({ busy: false, err: "", order: await trackOrder(orderNumber.trim(), phone.trim()) }); }
        catch (err) { setState({ busy: false, err: getErrorMessage(err), order: null }); }
    };
    const o = state.order; const cancelled = o?.status === "Cancelled";
    const at = (k) => o?.history?.find((h) => h.status === k)?.at;
    const reached = o ? STEPS.findIndex((s) => s.key === o.status) : -1;
    const inputCls = "w-full h-11 rounded-lg border border-forest/15 bg-white px-3 text-sm outline-none";
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-forest">Track your order</h1>
            <p className="text-sm text-slate mt-1">No login needed. Use the order number from your confirmation and your phone number.</p>
            <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end" noValidate>
                <div><label htmlFor="on" className="text-sm font-medium text-forest">Order number</label><input id="on" className={`${inputCls} mt-1.5 uppercase`} placeholder="EB-000123" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} /></div>
                <div><label htmlFor="ph" className="text-sm font-medium text-forest">Phone number</label><input id="ph" className={`${inputCls} mt-1.5`} placeholder="017XXXXXXXX" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <button type="submit" disabled={state.busy} className="h-11 px-6 rounded-lg bg-leaf text-white text-sm font-semibold disabled:opacity-60">{state.busy ? "Checking..." : "Track"}</button>
            </form>
            {state.err && <p role="alert" className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.err}</p>}
            {o && (
                <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-4 sm:p-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-display text-xl font-semibold text-forest">{o.orderNumber}</h2><span className="text-xs text-slate">Placed {dt(o.createdAt)}</span></div>
                    {cancelled ? (
                        <p className="mt-5 flex items-center gap-2 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-3"><X size={16} /> This order was cancelled.</p>
                    ) : (
                        <ol className="mt-6 sm:mt-7 grid grid-cols-4 gap-1" aria-label="Order progress">
                            {STEPS.map((s, i) => { const done = i <= reached; const Icon = s.icon; return (
                                <li key={s.key} className="flex flex-col items-center text-center gap-1.5 sm:gap-2 relative min-w-0" aria-current={i === reached ? "step" : undefined}>
                                    {i > 0 && <span aria-hidden="true" className={`absolute top-5 right-1/2 w-full h-0.5 -z-0 ${i <= reached ? "bg-leaf" : "bg-forest/10"}`} />}
                                    <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${done ? "bg-leaf text-white" : "bg-forest/10 text-forest/40"}`}><Icon size={18} /></span>
                                    <span className={`text-[11px] sm:text-xs leading-tight [overflow-wrap:anywhere] ${done ? "text-forest font-semibold" : "text-slate"}`}>{s.label}</span>
                                    {at(s.key) && <span className="text-[10px] sm:text-[11px] leading-tight text-slate [overflow-wrap:anywhere]">{dt(at(s.key))}</span>}
                                </li>); })}
                        </ol>)}
                    {o.courier && <p className="mt-6 text-sm rounded-lg bg-mint px-3 py-2.5">Courier: <b className="capitalize">{o.courier.provider === "mock" ? "Courier" : o.courier.provider}</b> · Tracking ID <b className="select-all [overflow-wrap:anywhere]">{o.courier.trackingCode}</b></p>}
                    <ul className="mt-6 divide-y divide-forest/10 text-sm">{o.items.map((it, i) => <li key={i} className="py-2 flex justify-between gap-3"><span className="min-w-0 [overflow-wrap:anywhere]">{it.title}{it.variantLabel ? ` (${it.variantLabel})` : ""} <span className="text-slate">× {it.quantity}</span></span></li>)}</ul>
                    <dl className="mt-3 pt-3 border-t border-forest/10 text-sm space-y-1">
                        <div className="flex justify-between text-slate"><dt>Subtotal</dt><dd>{formatBDT(o.subtotal)}</dd></div>
                        {o.discountAmount > 0 && <div className="flex justify-between text-leaf-dark"><dt>Discount</dt><dd>-{formatBDT(o.discountAmount)}</dd></div>}
                        <div className="flex justify-between text-slate"><dt>Delivery</dt><dd>{formatBDT(o.deliveryCharge)}</dd></div>
                        <div className="flex justify-between font-semibold text-forest text-base pt-1"><dt>Total {o.paymentMethod === "cod" ? "(pay on delivery)" : ""}</dt><dd>{formatBDT(o.totalAmount)}</dd></div>
                    </dl>
                </div>)}
        </div>
    );
}
