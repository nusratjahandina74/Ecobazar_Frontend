import { useState } from "react";
import { subscribeNewsletter } from "../../api/publicApi";
import { Mail } from "./Icons";
import { getErrorMessage } from "../../api/axiosInstance";

export default function NewsletterBox({ tone = "light" }) {
    const [email, setEmail] = useState(""); const [state, setState] = useState({ busy: false, msg: "", ok: false });
    const dark = tone === "dark";
    const submit = async (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setState({ busy: false, ok: false, msg: "Enter a valid email address." });
        setState({ busy: true, msg: "", ok: false });
        try { const r = await subscribeNewsletter(email.trim()); setEmail(""); setState({ busy: false, ok: true, msg: r.message || "Thanks for subscribing!" }); }
        catch (err) { setState({ busy: false, ok: false, msg: getErrorMessage(err) }); }
    };
    return (
        <form onSubmit={submit} noValidate>
            <label htmlFor={`nl-${tone}`} className={`text-sm font-semibold ${dark ? "text-snow" : "text-forest"}`}>Get offers in your inbox</label>
            <div className="mt-2 flex gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Mail size={15} className={`absolute left-3 top-3 ${dark ? "text-snow/40" : "text-forest/40"}`} />
                    <input id={`nl-${tone}`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                        className={`w-full h-10 rounded-lg pl-9 pr-3 text-sm border outline-none ${dark ? "bg-snow/10 border-snow/20 text-snow placeholder:text-snow/40" : "bg-white border-forest/15 text-forest"}`} />
                </div>
                <button type="submit" disabled={state.busy} className="h-10 px-4 rounded-lg bg-leaf text-white text-sm font-semibold disabled:opacity-60">{state.busy ? "Joining..." : "Subscribe"}</button>
            </div>
            {state.msg && <p role="status" className={`text-xs mt-2 ${state.ok ? (dark ? "text-leaf-soft" : "text-leaf-dark") : "text-red-500"}`}>{state.msg}</p>}
        </form>
    );
}
