import { useCallback, useEffect, useRef, useState } from "react";
export default function useFetch(loader, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tick, setTick] = useState(0);
    const loaderRef = useRef(loader);
    loaderRef.current = loader;

    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        setLoading(true);
        setError("");
        Promise.resolve(loaderRef.current(controller.signal))
            .then((res) => { if (active) setData(res); })
            .catch((err) => {
                if (!active || err?.original?.code === "ERR_CANCELED") return;
                setError(err.message || "Something went wrong.");
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; controller.abort(); };
    }, [...deps, tick]);

    const reload = useCallback(() => setTick((t) => t + 1), []);
    return { data, loading, error, reload, setData };
}
