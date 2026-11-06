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
        primary: "bg-leaf text-white  shadow-sm  ",
        accent: "bg-forest text-white  shadow-sm ",
        outline: "border border-leaf/40 text-leaf-dark   ",
        danger: "bg-red-600 text-white  shadow-sm",
    };

    return (
        <button type={type} className={`${base} ${variants[variant]} ${className}`} disabled={loading || disabled} {...rest}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Please wait" : children}
        </button>
    );
}
