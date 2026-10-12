import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Mail, Lock } from "../../components/common/Icons";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/axiosInstance";
import { isEmail, passwordIssue } from "../../utils/validators";

function getPasswordStrength(password) {
    if (!password) return { label: "", width: "0%", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        { label: "Weak", width: "25%", color: "bg-red-400" },
        { label: "Fair", width: "50%", color: "bg-yellow-400" },
        { label: "Good", width: "75%", color: "bg-leaf" },
        { label: "Strong", width: "100%", color: "bg-leaf-dark" },
    ];
    return levels[Math.min(score, 3)];
}

export default function Register() {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", terms: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const navigate = useNavigate();
    const { register } = useAuth();
    const strength = getPasswordStrength(form.password);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
        setErrors({ ...errors, [name]: "" });
        setSubmitError("");
    };

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!isEmail(form.email)) errs.email = "Enter a valid email";
        const pw = passwordIssue(form.password);
        if (pw) errs.password = pw;
        if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords don't match";
        if (!form.terms) errs.terms = "You must accept the Terms and Conditions";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) return setErrors(errs);

        setLoading(true);
        setSubmitError("");
        try {
            await register({
                email: form.email.trim(),
                password: form.password,
                confirmPassword: form.confirmPassword,
                terms: form.terms,
                firstName: form.firstName.trim() || undefined,
                lastName: form.lastName.trim() || undefined,
            });
            navigate("/login", { state: { registered: true } });
        } catch (err) {
            setSubmitError(getErrorMessage(err));
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create your account" subtitle="Start shopping in a couple of minutes.">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div className="grid grid-cols-2 gap-3">
                    <InputField label="First name" name="firstName" icon={User} value={form.firstName} onChange={handleChange} error={errors.firstName} placeholder="Jane" autoComplete="given-name" />
                    <InputField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} placeholder="Doe" autoComplete="family-name" />
                </div>
                <InputField label="Email" name="email" type="email" icon={Mail} value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" autoComplete="email" />

                <div>
                    <InputField label="Password" name="password" type="password" icon={Lock} value={form.password} onChange={handleChange} error={errors.password} placeholder="At least 8 characters" autoComplete="new-password" />
                    {form.password && (
                        <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-1 flex-1 rounded-full bg-forest/10 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                            </div>
                            <span className="text-xs text-slate w-12">{strength.label}</span>
                        </div>
                    )}
                </div>

                <InputField label="Confirm password" name="confirmPassword" type="password" icon={Lock} value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" autoComplete="new-password" />

                <div>
                    <label className="flex items-start gap-2.5 text-sm text-slate cursor-pointer">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={form.terms}
                            onChange={handleChange}
                            aria-invalid={!!errors.terms}
                            className="mt-0.5 w-4 h-4 accent-leaf"
                        />
                        <span>I accept the Terms and Conditions</span>
                    </label>
                    {errors.terms && <p role="alert" className="text-xs text-red-500 mt-1">{errors.terms}</p>}
                </div>

                {submitError && (
                    <p role="alert" className="text-sm text-red-600 text-center bg-red-50 py-2 px-3 rounded-lg">{submitError}</p>
                )}

                <Button type="submit" loading={loading} className="mt-1">Create Account</Button>
            </form>

            <div className="flex items-center gap-3 my-6">
                <div className="h-px bg-forest/10 flex-1" />
                <span className="text-xs text-slate/60">OR</span>
                <div className="h-px bg-forest/10 flex-1" />
            </div>

            <p className="text-sm text-slate text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-leaf font-semibold hover:text-forest hover:underline underline-offset-2">Log in</Link>
            </p>
        </AuthLayout>
    );
}
