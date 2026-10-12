import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { Search, Plus } from "../../components/common/Icons";
import ProductTable from "../../components/admin/ProductTable";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateViews";
import useFetch from "../../hooks/useFetch";
import { getProducts, deleteProduct } from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";
import { PRODUCT_DELETE_ROLES } from "../../utils/constants";

const statusFilters = ["all", "active", "pending", "inactive"];
const PER_PAGE = 10;

export default function ManageProducts() {
    const { user } = useAuth();
    const toast = useToast();
    const { reload: reloadCatalog } = useCatalog();
    const { data, loading, error, reload } = useFetch((signal) => getProducts({ signal }), []);
    const products = useMemo(() => data || [], [data]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const canDelete = PRODUCT_DELETE_ROLES.includes(user.role);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return products.filter((p) =>
            (p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
            (statusFilter === "all" || p.status === statusFilter));
    }, [products, search, statusFilter]);

    useEffect(() => setPage(1), [search, statusFilter]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProduct(deleteTarget._id);
            toast.success("Product deleted");
            setDeleteTarget(null);
            reload();
            reloadCatalog();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-forest">Products</h1>
                    <p className="text-sm text-slate mt-1">{loading ? "Loading…" : `${products.length} total products`}</p>
                </div>
                <Link to="/admin/products/create" className="flex items-center gap-2 bg-leaf text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-leaf-dark hover:shadow-md hover:shadow-leaf/30 transition-all">
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or SKU..." aria-label="Search products"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-forest/15 bg-white text-sm hover:border-leaf/50 focus:outline-none focus:ring-4 focus:ring-leaf/15 focus:border-leaf transition-all"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {statusFilters.map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${statusFilter === s ? "bg-leaf text-white" : "bg-white border border-forest/15 text-forest/70 hover:border-leaf hover:text-leaf"}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <PageLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : (
                <>
                    <ProductTable products={pageItems} onDeleteClick={setDeleteTarget} canDelete={canDelete} />
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            <Modal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete product?"
                footer={
                    <>
                        <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-forest/70 hover:bg-mint transition-colors">Cancel</button>
                        <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60">
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </>
                }
            >
                <p className="text-sm text-slate">Are you sure you want to delete <strong className="text-forest">{deleteTarget?.title}</strong>? This can't be undone.</p>
            </Modal>
        </div>
    );
}
