export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

// Backend only checks for non-empty passwords; we enforce a sensible minimum on the client.
export const passwordIssue = (v) => {
    if (!v) return "Password is required";
    if (v.length < 8) return "Password must be at least 8 characters";
    return "";
};

// Bangladeshi mobile numbers, e.g. 01712345678 or +8801712345678
export const isBdPhone = (v) => /^(?:\+?88)?01[3-9]\d{8}$/.test(String(v || "").replace(/[\s-]/g, ""));
