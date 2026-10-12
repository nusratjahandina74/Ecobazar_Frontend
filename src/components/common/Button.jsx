import { Loader2 } from "./Icons";

export default function Button({
    children,
    variant = "primary",
    loading = false,
    className = "",
    type = "button",
    disabled,
    ...rest
}) {
    const base =
        "w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 " +
        "active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 disabled:cursor-not-allowed " +
        "flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-leaf text-white hover:bg-leaf-dark shadow-sm hover:shadow-md hover:shadow-leaf/30",
        accent: "bg-forest text-white hover:bg-leaf shadow-sm hover:shadow-md",
        outline: "border border-leaf/40 text-leaf-dark hover:bg-leaf hover:text-white hover:border-leaf",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    return (
        <button type={type} className={`${base} ${variants[variant]} ${className}`} disabled={loading || disabled} {...rest}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Please wait" : children}
        </button>
    );
}
