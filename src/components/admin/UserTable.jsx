import { Link } from "react-router";
import { Eye, Trash2 } from "../common/Icons";

function RoleBadge({ role }) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
        role === "admin" ? "text-amber bg-amber/10" : "text-slate bg-ink/5"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
        status === "active" ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
      }`}
    >
      {status}
    </span>
  );
}

export default function UserTable({ users, onDeleteClick }) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-ink/10">
        <p className="text-slate text-sm">No users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs text-slate uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
              return (
                <tr key={user._id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{user.name}</p>
                        <p className="text-xs text-slate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate">{user.phone}</td>
                  <td className="px-5 py-3"><RoleBadge role={user.role} /></td>
                  <td className="px-5 py-3"><StatusBadge status={user.status} /></td>
                  <td className="px-5 py-3 text-slate">
                    {new Date(user.joined).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink/50 hover:bg-ink/5 hover:text-ink transition-colors"
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        onClick={() => onDeleteClick(user)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink/50 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
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
};