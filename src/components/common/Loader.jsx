import { Loader2 } from "./Icons";

export const Skeleton = ({ className = "" }) => <div aria-hidden="true" className={`skeleton rounded-md ${className}`} />;

/* Layout-shaped skeleton for the Cart / Checkout pages (title + rows + summary). */
export function CartSkeleton() {
    return (
        <div role="status" aria-label="Loading" className="px-4 pt-8 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pt-10 fade-up">
            <Skeleton className="w-56 h-8 mb-6" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white border rounded-xl border-forest/10">
                            <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-2.5"><Skeleton className="w-3/5 h-4" /><Skeleton className="w-2/5 h-3 opacity-70" /><Skeleton className="w-24 h-4" /></div>
                        </div>
                    ))}
                </div>
                <div className="p-5 space-y-3 bg-white border rounded-xl border-forest/10 h-fit">
                    <Skeleton className="w-40 h-5" /><Skeleton className="w-full h-3" /><Skeleton className="w-full h-3" /><Skeleton className="w-2/3 h-3" />
                    <Skeleton className="w-full h-11 mt-2 rounded-lg" />
                </div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
}

/* Brand loader: a leaf that draws itself inside an orbiting ring, with bouncing dots. */
export function LeafLoader({ size = 56, label = "", className = "" }) {
  return (
    <div role="status" aria-label={label || "Loading"} className={`flex flex-col items-center justify-center gap-3 text-leaf ${className}`}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle className="leaf-orbit" cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="28 104" />
        <path className="leaf-draw" d="M14 33C13 21 21 13 34 12C35 25 28 34 14 33Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path className="leaf-draw" d="M14 33L27 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="flex items-center gap-1.5" aria-hidden="true"><i className="leaf-dot" /><i className="leaf-dot" /><i className="leaf-dot" /></span>
      {label && <p className="text-sm text-slate">{label}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/* Generic loader for lists / sections. */
export function PageLoader() {
    return <div className="min-h-[60vh] flex items-center justify-center fade-up"><LeafLoader size={64} label="Loading" /></div>;
}

export function InlineLoader({ size = 16, className = "" }) {
    return <Loader2 size={size} className={`animate-spin ${className}`} />;
};
