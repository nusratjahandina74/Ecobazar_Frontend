import { useState, useMemo, useEffect } from "react";
import { Search } from "../../components/common/Icons";
import UserTable from "../../components/admin/UserTable";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import { PageLoader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateViews";
import useFetch from "../../hooks/useFetch";
import { getUsers, deleteUser, updateUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ROLES } from "../../utils/constants";

const roleFilters = ["all", ...Object.values(ROLES)];
const PER_PAGE = 10;

export default function ManageUsers() {
    const { user: me } = useAuth();
    const toast = useToast();
    const { data, loading, error, reload } = useFetch(() => getUsers(), []);
    const users = useMemo(() => data || [], [data]);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [busyId, setBusyId] = useState(null);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return users.filter((u) => (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) && (roleFilter === "all" || u.role === roleFilter));
    }, [users, search, roleFilter]);

    useEffect(() => setPage(1), [search, roleFilter]);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteUser(deleteTarget._id);
            toast.success("User deleted");
            setDeleteTarget(null);
            reload();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleHold = async (u) => {
        setBusyId(u._id);
        try {
            await updateUser(u._id, { isHold: !u.isHold });
            toast.success(u.isHold ? "Account released" : "Account put on hold");
            reload();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold font-display text-forest">Users</h1>
                <p className="mt-1 text-sm text-slate">{loading ? "Loading…" : `${users.length} registered users`}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." aria-label="Search users"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-forest/15 bg-white text-sm hover:border-leaf/50 focus:outline-none focus:ring-4 focus:ring-leaf/15 focus:border-leaf transition-all"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {roleFilters.map((r) => (
                        <button key={r} onClick={() => setRoleFilter(r)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${roleFilter === r ? "bg-leaf text-white" : "bg-white border border-forest/15 text-forest/70 hover:border-leaf hover:text-leaf"}`}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <PageLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : (
                <>
                    <UserTable users={pageItems} onDeleteClick={setDeleteTarget} onToggleHold={handleToggleHold} currentUserId={me._id} busyId={busyId} />
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            <Modal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete user?"
                footer={
                    <>
                        <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium transition-colors rounded-lg text-forest/70 hover:bg-mint">Cancel</button>
                        <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60">
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </>
                }
            >
                <p className="text-sm text-slate">Are you sure you want to delete <strong className="text-forest">{deleteTarget?.name}</strong> ({deleteTarget?.email})? This can't be undone.</p>
            </Modal>
        </div>
    );
}
