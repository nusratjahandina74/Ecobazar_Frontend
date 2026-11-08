import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { CircleCheck } from "../common/Icons";
import { getProductReviews, getReviewState, submitReview } from "../../api/publicApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { Stars, StarPicker } from "../common/Stars";

const dateFmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function ReviewForm({ productId, existing, onDone }) {
    const [rating, setRating] = useState(existing?.rating || 0); const [title, setTitle] = useState(existing?.title || ""); const [comment, setComment] = useState(existing?.comment || "");
    const [state, setState] = useState({ busy: false, err: "", msg: "" });
    const submit = async (e) => {
        e.preventDefault();
        if (!rating) return setState({ busy: false, err: "Choose a star rating.", msg: "" });
        setState({ busy: true, err: "", msg: "" });
        try { const r = await submitReview(productId, { rating, title: title.trim(), comment: comment.trim() }); setState({ busy: false, err: "", msg: r.message }); onDone(); }
        catch (err) { setState({ busy: false, err: getErrorMessage(err), msg: "" }); }
    };
    return (
        <form onSubmit={submit} className="rounded-xl border border-forest/10 bg-mint/50 p-5 space-y-3">
            <p className="text-sm font-semibold text-forest">{existing ? "Update your review" : "Write a review"}</p>
            <StarPicker value={rating} onChange={setRating} />
            <input aria-label="Review title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder="Title (optional)" className="w-full h-10 rounded-lg border border-forest/15 bg-white px-3 text-sm outline-none" />
            <textarea aria-label="Your review" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1500} rows={4} placeholder="How was the product?" className="w-full rounded-lg border border-forest/15 bg-white px-3 py-2 text-sm outline-none" />
            {state.err && <p role="alert" className="text-sm text-red-600">{state.err}</p>}
            {state.msg && <p role="status" className="text-sm text-leaf-dark">{state.msg}</p>}
            <button type="submit" disabled={state.busy} className="h-10 px-5 rounded-lg bg-leaf text-white text-sm font-semibold disabled:opacity-60">{state.busy ? "Sending..." : "Submit review"}</button>
        </form>
    );
}

export default function ReviewsSection({ productId }) {
    const { isAuthenticated } = useAuth(); const { settings } = useSettings();
    const [data, setData] = useState(null); const [page, setPage] = useState(1); const [me, setMe] = useState(null);
    const load = useCallback(() => getProductReviews(productId, { page, limit: 6 }).then(setData).catch(() => setData({ data: [], summary: { count: 0, average: 0, distribution: {} }, pagination: {} })), [productId, page]);
    useEffect(() => { load(); }, [load]);
    useEffect(() => { if (isAuthenticated) getReviewState(productId).then(setMe).catch(() => setMe(null)); else setMe(null); }, [isAuthenticated, productId]);
    if (settings.reviews?.enabled === false) return null;
    const s = data?.summary || { count: 0, average: 0, distribution: {} };
    return (
        <section id="reviews" className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-forest/10" aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="font-display text-2xl font-semibold text-forest">Customer reviews</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
                <div>
                    {s.count ? (<>
                        <p className="font-display text-5xl font-semibold text-forest">{Number(s.average).toFixed(1)}</p>
                        <Stars value={s.average} size={18} className="mt-1" />
                        <p className="text-sm text-slate mt-1">{s.count} review{s.count > 1 ? "s" : ""}</p>
                        <div className="mt-4 space-y-1.5">{[5, 4, 3, 2, 1].map((n) => { const c = s.distribution?.[n] || 0; return (
                            <div key={n} className="flex items-center gap-2 text-xs text-slate"><span className="w-3">{n}</span><div className="flex-1 h-2 rounded-full bg-forest/10 overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${(c / s.count) * 100}%` }} /></div><span className="w-6 text-right">{c}</span></div>); })}</div>
                    </>) : <p className="text-sm text-slate">No reviews yet. Be the first to share your experience.</p>}
                    <div className="mt-6">
                        {!isAuthenticated ? <p className="text-sm text-slate"><Link to="/login" className="text-leaf-dark underline">Log in</Link> to write a review.</p>
                            : me?.canReview ? <ReviewForm key={me.existing?.rating || 0} productId={productId} existing={me.existing} onDone={() => { load(); getReviewState(productId).then(setMe).catch(() => {}); }} />
                            : me ? <p className="text-sm text-slate">{me.reason}</p> : null}
                    </div>
                </div>
                <ul className="space-y-5">
                    {(data?.data || []).map((r) => (
                        <li key={r._id} className="rounded-xl border border-forest/10 bg-white p-4 sm:p-5">
                            <div className="flex flex-wrap items-center gap-2"><Stars value={r.rating} size={15} /><span className="text-sm font-semibold text-forest min-w-0 [overflow-wrap:anywhere]">{r.userName}</span>{r.verified && <span className="inline-flex items-center gap-1 text-xs text-leaf-dark"><CircleCheck size={14} /> Verified buyer</span>}<span className="text-xs text-slate ml-auto">{dateFmt(r.createdAt)}</span></div>
                            {r.title && <p className="text-sm font-semibold text-forest mt-2 [overflow-wrap:anywhere]">{r.title}</p>}
                            {r.comment && <p className="text-sm text-slate mt-1 whitespace-pre-wrap break-words">{r.comment}</p>}
                            {r.adminReply && <div className="mt-3 rounded-lg bg-mint px-3 py-2 text-sm"><b className="text-forest">Reply from the shop:</b> <span className="text-slate [overflow-wrap:anywhere]">{r.adminReply}</span></div>}
                        </li>))}
                    {data?.pagination?.pages > 1 && (
                        <li className="flex flex-wrap items-center gap-3 text-sm"><button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-forest/15 disabled:opacity-40">Previous</button><span className="text-slate">Page {page} of {data.pagination.pages}</span><button type="button" disabled={page >= data.pagination.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-forest/15 disabled:opacity-40">Next</button></li>)}
                </ul>
            </div>
        </section>
    );
}
