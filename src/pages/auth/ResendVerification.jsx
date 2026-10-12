import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { resendVerificationApi } from "../../api/authApi";
import { getErrorMessage } from "../../api/axiosInstance";
import { isEmail } from "../../utils/validators";

export default function ResendVerification() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return setError("Email is required");
        if (!isEmail(email)) return setError("Enter a valid email");

        setLoading(true);
        setError("");
        try {
            await resendVerificationApi(email.trim());
            setSent(true);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <AuthLayout title="Verification email sent" subtitle="Check your inbox for the new link.">
                <button onClick={() => setSent(false)} className="text-sm text-leaf hover:text-forest hover:underline">Send to a different email</button>
                <Link to="/login" className="block text-sm text-leaf font-medium hover:underline mt-6">← Back to login</Link>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Resend verification email" subtitle="Enter your email to get a new verification link.">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <InputField
                    label="Email" name="email" type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    error={error} placeholder="you@example.com" autoComplete="email"
                />
                <Button type="submit" loading={loading}>Resend Email</Button>
            </form>
            <Link to="/login" className="block text-sm text-leaf font-medium hover:text-forest hover:underline mt-6 text-center">← Back to login</Link>
        </AuthLayout>
    );
}
