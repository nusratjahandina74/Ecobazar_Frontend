import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { resetPasswordApi } from "../../api/authApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { passwordIssue } from "../../utils/validators";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [done, setDone] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setSubmitError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        const pw = passwordIssue(form.password);
        if (pw) errs.password = pw;
        if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords don't match";
        if (Object.keys(errs).length) return setErrors(errs);

        setLoading(true);
        try {
            await resetPasswordApi(token, form.password, form.confirmPassword);
            setDone(true);
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setSubmitError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <AuthLayout title="Password updated" subtitle="You can now log in with your new password.">
                <Link to="/login" className="text-sm font-semibold text-leaf hover:text-forest hover:underline">Continue to login →</Link>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Set a new password" subtitle="Make sure it's something you'll remember.">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <InputField label="New password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="At least 8 characters" autoComplete="new-password" />
                <InputField label="Confirm new password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" autoComplete="new-password" />
                {submitError && <p role="alert" className="text-sm text-red-600 text-center bg-red-50 py-2 px-3 rounded-lg">{submitError}</p>}
                <Button type="submit" loading={loading}>Reset Password</Button>
            </form>
            {submitError && (
                <Link to="/forgot-password" className="block text-sm text-leaf font-medium hover:underline mt-5 text-center">Request a new reset link</Link>
            )}
        </AuthLayout>
    );
}
