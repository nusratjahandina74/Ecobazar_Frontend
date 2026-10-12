import { Link } from "react-router";

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Brand panel */}
            <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-forest via-leaf-dark to-leaf text-white p-10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

                <Link to="/" className="font-display text-2xl font-semibold relative z-10">
                    Eco<span className="text-white/80">Bazaar</span>
                </Link>

                <div className="relative z-10 max-w-sm">
                    <p className="font-display text-3xl leading-snug">
                        Shop green. Live better. Everything you need in one place.
                    </p>
                    <p className="text-white/70 text-sm mt-4">
                        Eco-friendly products delivered across Bangladesh.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-white/60">© {new Date().getFullYear()} EcoBazaar</div>
            </div>

            {/* Form panel */}
            <div className="flex items-center justify-center p-6 sm:p-10 bg-white">
                <div className="w-full max-w-sm">
                    <div className="md:hidden mb-8">
                        <Link to="/" className="font-display text-2xl font-semibold text-forest">
                            Eco<span className="text-leaf">Bazaar</span>
                        </Link>
                    </div>

                    <h1 className="font-display text-2xl font-semibold text-forest">{title}</h1>
                    {subtitle && <p className="text-slate text-sm mt-1.5">{subtitle}</p>}

                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
