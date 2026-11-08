import { useState } from "react";
import { TicketPercent, X } from "../common/Icons";
import { getErrorMessage } from "../../api/axiosInstance";

/** Coupon entry. The server validates and prices the coupon; the browser only shows the result. */
export default function CouponBox({ applied, onApply, onRemove }) {
    const [code, setCode] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
    const apply = async () => {
        if (!code.trim()) return setErr("Enter a coupon code.");
        setBusy(true); setErr("");
        try { await onApply(code.trim()); setCode(""); } catch (e) { setErr(getErrorMessage(e)); } finally { setBusy(false); }
    };
    if (applied) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-mint px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 min-w-0 text-leaf-dark [overflow-wrap:anywhere]"><TicketPercent size={16} className="shrink-0" /><b>{applied.code}</b> applied{applied.discount > 0 ? ` - you save ৳${applied.discount}` : " - free delivery"}</span>
                <button type="button" onClick={onRemove} aria-label="Remove coupon" className="p-2 -m-1 shrink-0 text-slate"><X size={15} /></button>
            </div>
        );
    }
    return (
        <div>
            <label htmlFor="coupon" className="text-sm font-medium text-forest">Have a coupon?</label>
            <div className="mt-1.5 flex gap-2">
                <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } }} placeholder="Enter code" autoComplete="off" className="flex-1 min-w-0 h-10 rounded-lg border border-forest/15 px-3 text-sm uppercase outline-none" />
                <button type="button" onClick={apply} disabled={busy} className="h-10 px-4 shrink-0 rounded-lg border border-leaf text-leaf-dark text-sm font-semibold disabled:opacity-60">{busy ? "Checking..." : "Apply"}</button>
            </div>
            {err && <p role="alert" className="text-xs text-red-600 mt-1.5">{err}</p>}
        </div>
    );
}
