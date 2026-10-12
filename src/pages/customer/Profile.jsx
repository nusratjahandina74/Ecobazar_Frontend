import { useEffect, useState } from "react";
import { Link } from "react-router";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { User, Mail, Phone } from "../../components/common/Icons";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { updateUser } from "../../api/userApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { isBdPhone } from "../../utils/validators";
import { formatDate } from "../../utils/adapters";

export default function Profile() {
    const { user, setUser } = useAuth();
    const toast = useToast();
    const [form, setForm] = useState({ firstName: "", lastName: "", phoneNumber: "" });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) setForm({ firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber });
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.phoneNumber.trim() && !isBdPhone(form.phoneNumber)) {
            return setErrors({ phoneNumber: "Enter a valid Bangladeshi phone number" });
        }
        setSaving(true);
        try {
            // only fields the backend lets a customer edit (role / hold / verified are admin-only)
            const updated = await updateUser(user._id, {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phoneNumber: form.phoneNumber.trim(),
            });
            setUser(updated);
            toast.success("Profile updated");
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const initials = (user.name || "?").split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase();

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-leaf text-white flex items-center justify-center font-display text-xl font-semibold shrink-0">{initials}</div>
                <div>
                    <p className="font-display text-xl font-semibold text-forest">{user.name}</p>
                    <p className="text-sm text-slate">Member since {formatDate(user.createdAt)} · <span className="capitalize">{user.role}</span></p>
                </div>
            </div>

            {!user.isVerified && (
                <div role="status" className="mb-6 px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
                    Your email isn't verified yet.{" "}
                    <Link to="/resend-verification" className="font-semibold underline">Resend verification email</Link>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-forest/10 p-5 sm:p-6" noValidate>
                <h2 className="font-display text-lg font-semibold text-forest mb-5">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="First name" name="firstName" icon={User} value={form.firstName} onChange={handleChange} error={errors.firstName} />
                    <InputField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
                    <InputField label="Email" name="email" type="email" icon={Mail} value={user.email} onChange={() => {}} readOnly disabled />
                    <InputField label="Phone" name="phoneNumber" icon={Phone} value={form.phoneNumber} onChange={handleChange} error={errors.phoneNumber} placeholder="01XXXXXXXXX" />
                </div>
                <p className="text-xs text-slate mt-3">Email can't be changed here.</p>
                <div className="mt-6">
                    <Button type="submit" loading={saving} className="w-auto px-6">Save Changes</Button>
                </div>
            </form>
        </div>
    );
}
