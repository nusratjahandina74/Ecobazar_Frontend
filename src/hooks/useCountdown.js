import { useEffect, useState } from "react";

/** Live countdown to `endsAt`. Ticks once a second; stops when the time is up. */
export default function useCountdown(endsAt) {
    const target = endsAt ? new Date(endsAt).getTime() : 0;
    const calc = () => Math.max(0, target - Date.now());
    const [left, setLeft] = useState(calc);
    useEffect(() => {
        if (!target) return undefined;
        setLeft(calc());
        const t = setInterval(() => { const l = calc(); setLeft(l); if (l <= 0) clearInterval(t); }, 1000);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target]);
    const s = Math.floor(left / 1000);
    return { done: !target || left <= 0, days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}
