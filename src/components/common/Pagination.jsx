import { ChevronLeft, ChevronRight } from "./Icons";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    // windowed page list: 1 … 4 5 [6] 7 8 … 20
    const pages = [];
    for (let p = 1; p <= totalPages; p += 1) {
        if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) pages.push(p);
        else if (pages[pages.length - 1] !== "…") pages.push("…");
    }

    return (
        <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="w-9 h-9 rounded-lg border border-forest/15 flex items-center justify-center text-forest/60
          hover:bg-leaf hover:text-white hover:border-leaf disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-forest/60 disabled:hover:border-forest/15 transition-colors"
            >
                <ChevronLeft size={16} />
            </button>

            {pages.map((page, i) =>
                page === "…" ? (
                    <span key={`gap-${i}`} className="w-6 text-center text-forest/40">…</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === currentPage ? "bg-leaf text-white" : "text-forest/70 hover:bg-mint hover:text-leaf"}`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="w-9 h-9 rounded-lg border border-forest/15 flex items-center justify-center text-forest/60
          hover:bg-leaf hover:text-white hover:border-leaf disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-forest/60 disabled:hover:border-forest/15 transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </nav>
    );
}
