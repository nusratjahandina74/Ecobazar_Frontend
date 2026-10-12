import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Mail, Lock } from "../../components/common/Icons";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axiosInstance";
import { isEmail } from "../../utils/validators";
import { ADMIN_PANEL_ROLES } from "../../utils/constants";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const registered = location.state?.registered;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setSubmitError("");
    };

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!isEmail(form.email)) errs.email = "Enter a valid email";
        if (!form.password) errs.password = "Password is required";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) return setErrors(errs);

        setLoading(true);
        setSubmitError("");
        try {
            const user = await login(form.email.trim(), form.password);
            const fromLoc = location.state?.from;
            const from = fromLoc ? `${fromLoc.pathname}${fromLoc.search || ""}` : "";
            navigate(from || (ADMIN_PANEL_ROLES.includes(user.role) ? "/admin" : "/"), { replace: true });
        } catch (err) {
            setSubmitError(getErrorMessage(err));
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Log in to continue to your account.">
            {registered && (
                <p role="status" className="mb-4 py-2.5 px-3 text-sm rounded-lg bg-mint text-leaf-dark border border-leaf/20">
                    Account created. Check your email for the verification link, then log in.
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <InputField label="Email" name="email" type="email" icon={Mail} value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" autoComplete="email" />
                <InputField label="Password" name="password" type="password" icon={Lock} value={form.password} onChange={handleChange} error={errors.password} placeholder="••••••••" autoComplete="current-password" />

                <div className="flex justify-end -mt-1">
                    <Link to="/forgot-password" className="text-xs font-medium text-leaf hover:text-forest hover:underline underline-offset-2">
                        Forgot password?
                    </Link>
                </div>

                {submitError && (
                    <p role="alert" className="py-2 px-3 text-sm text-center text-red-600 rounded-lg bg-red-50">{submitError}</p>
                )}

                <Button type="submit" loading={loading} className="mt-1">Log In</Button>
            </form>

            <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-forest/10" />
                <span className="text-xs text-slate/60">OR</span>
                <div className="flex-1 h-px bg-forest/10" />
            </div>

            <p className="text-sm text-center text-slate">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-leaf hover:text-forest hover:underline underline-offset-2">Register</Link>
            </p>
        </AuthLayout>
    );
}
