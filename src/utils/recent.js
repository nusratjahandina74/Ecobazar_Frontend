// Recently viewed product ids (per browser). Used for the "Recently viewed" strip.
const KEY = "ecobazar_recent";
export const getRecent = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
export const pushRecent = (id) => { try { localStorage.setItem(KEY, JSON.stringify([id, ...getRecent().filter((x) => x !== id)].slice(0, 12))); } catch { /* storage unavailable */ } };
