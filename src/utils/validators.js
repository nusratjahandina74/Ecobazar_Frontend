export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

export const passwordIssue = (v) => {
    if (!v) return "Password is required";
    if (v.length < 8) return "Password must be at least 8 characters";
    return "";
};

export const isBdPhone = (v) => /^(?:\+?88)?01[3-9]\d{8}$/.test(String(v || "").replace(/[\s-]/g, ""));
