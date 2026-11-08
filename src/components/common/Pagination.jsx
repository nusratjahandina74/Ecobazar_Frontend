import { ChevronLeft, ChevronRight } from "./Icons";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    // windowed page list: 1 … 4 5 [6] 7 8 … 20
    const pages = [];
    for (let p = 1; p <= totalPages; p += 1) {
        if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) pages.push(p);
        else if (pages[pages.length - 1] !== "…") pages.push("…");
    }

    const arrow = "w-10 h-10 sm:w-9 sm:h-9 rounded-lg border border-forest/15 flex items-center justify-center text-forest/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0";
    const prev = (
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page" className={arrow}>
            <ChevronLeft size={16} />
        </button>
    );
    const next = (
        <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="Next page" className={arrow}>
            <ChevronRight size={16} />
        </button>
    );

    return (
        <nav className="mt-8 sm:mt-10" aria-label="Pagination">
            {/* phones: compact, can never overflow a 320px screen */}
            <div className="flex items-center justify-center gap-4 sm:hidden">
                {prev}
                <span className="text-sm text-forest/70">Page <b className="text-forest">{currentPage}</b> of {totalPages}</span>
                {next}
            </div>

            {/* tablets and up: windowed list */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-1.5">
                {prev}
                {pages.map((page, i) =>
                    page === "…" ? (
                        <span key={`gap-${i}`} className="w-6 text-center text-forest/40">…</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            aria-current={page === currentPage ? "page" : undefined}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === currentPage ? "bg-leaf text-white" : "text-forest/70  "}`}
                        >
                            {page}
                        </button>
                    )
                )}
                {next}
            </div>
        </nav>
    );
}
