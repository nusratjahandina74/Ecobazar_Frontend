import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Search, Plus } from "../../components/common/Icons";
import ProductTable from "../../components/admin/ProductTable";
import Modal from "../../components/common/Modal";
import { mockProducts } from "../../utils/mockProducts";

const statusFilters = ["all", "active", "pending", "inactive"];

export default function ManageProducts() {
    // TODO: replace with data fetched from GET /get-all-products
    const [products, setProducts] = useState(mockProducts);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch =
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.sku.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [products, search, statusFilter]);

    const handleDelete = () => {
        setDeleting(true);
        // TODO: connect to DELETE /delete-product/:id
        console.log("Delete product:", deleteTarget._id);
        setTimeout(() => {
            setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
            setDeleting(false);
            setDeleteTarget(null);
        }, 500);
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-ink">Products</h1>
                    <p className="text-sm text-slate mt-1">{products.length} total products</p>
                </div>
                <Link
                    to="/admin/products/create"
                    className="flex items-center gap-2 bg-ink text-paper text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-ink/90 transition-colors"
                >
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or SKU..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink/15 bg-white text-sm
              focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    {statusFilters.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${statusFilter === s ? "bg-ink text-paper" : "bg-white border border-ink/15 text-ink/60 hover:bg-ink/5"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <ProductTable products={filtered} onDeleteClick={setDeleteTarget} />

            <Modal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete product?"
                footer={
                    <>
                        <button
                            onClick={() => setDeleteTarget(null)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-ink/70 hover:bg-ink/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </>
                }
            >
                <p className="text-sm text-slate">
                    Are you sure you want to delete <strong className="text-ink">{deleteTarget?.title}</strong>? This can't be undone.
                </p>
            </Modal>
        </div>
    );
};