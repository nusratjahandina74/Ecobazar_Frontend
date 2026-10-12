import { Link } from "react-router";
import { Eye, Trash2 } from "../common/Icons";
import { formatDate } from "../../utils/adapters";

export function RoleBadge({ role }) {
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${role === "admin" ? "text-white bg-leaf" : "text-leaf-dark bg-leaf/10"}`}>{role}</span>;
}

export function HoldBadge({ isHold }) {
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isHold ? "text-red-600 bg-red-50" : "text-leaf-dark bg-leaf/10"}`}>{isHold ? "On hold" : "Active"}</span>;
}

export default function UserTable({ users, onDeleteClick, onToggleHold, currentUserId, busyId }) {
  if (users.length === 0) {
    return <div className="text-center py-16 bg-white rounded-xl border border-forest/10"><p className="text-slate text-sm">No users found.</p></div>;
  }
  const iconBtn = "w-8 h-8 rounded-lg flex items-center justify-center text-forest/50 transition-colors disabled:opacity-30";

  return (
    <div className="bg-white rounded-xl border border-forest/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/10 text-left text-xs text-slate uppercase tracking-wide bg-mint/60">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const initials = u.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
              const isSelf = u._id === currentUserId;
              return (
                <tr key={u._id} className="border-b border-forest/5 last:border-0 hover:bg-mint/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-leaf text-white flex items-center justify-center text-xs font-semibold shrink-0">{initials}</div>
                      <div>
                        <p className="font-medium text-forest">{u.name}</p>
                        <p className="text-xs text-slate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate">{u.phoneNumber || "—"}</td>
                  <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-5 py-3 text-slate">{u.isVerified ? "Verified" : "Unverified"}</td>
                  <td className="px-5 py-3"><HoldBadge isHold={u.isHold} /></td>
                  <td className="px-5 py-3 text-slate whitespace-nowrap">{formatDate(u.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/users/${u._id}`} aria-label={`View ${u.name}`} className={`${iconBtn} hover:bg-leaf/10 hover:text-leaf`}><Eye size={15} /></Link>
                      <button
                        onClick={() => onToggleHold(u)}
                        disabled={isSelf || busyId === u._id}
                        className="px-2.5 h-8 rounded-lg text-xs font-semibold border border-forest/15 text-forest/70 hover:border-leaf hover:text-leaf disabled:opacity-30 transition-colors"
                      >
                        {u.isHold ? "Release" : "Hold"}
                      </button>
                      <button onClick={() => onDeleteClick(u)} disabled={isSelf} aria-label={`Delete ${u.name}`} className={`${iconBtn} hover:bg-red-50 hover:text-red-500`}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
