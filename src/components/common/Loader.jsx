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

/* Generic loader for lists / sections. */
export function PageLoader() {
    return (
        <div role="status" className="min-h-[60vh] flex flex-col items-center justify-center gap-4 fade-up">
            <div className="relative w-12 h-12">
                <span className="absolute inset-0 border-4 rounded-full border-leaf/15" />
                <span className="absolute inset-0 border-4 border-transparent rounded-full border-t-leaf animate-spin" />
            </div>
            <p className="text-sm text-slate">Loading...</p>
        </div>
    );
}

export function InlineLoader({ size = 16, className = "" }) {
    return <Loader2 size={size} className={`animate-spin ${className}`} />;
};
