import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import { verifyEmailApi } from "../../api/authApi";
import { getErrorMessage } from "../../api/axiosInstance";

export default function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState("verifying"); // verifying | success | error
    const [message, setMessage] = useState("");
    const startedFor = useRef(null);

    useEffect(() => {
        // guard against React StrictMode's double effect: a verification token should be used once
        if (startedFor.current === token) return;
        startedFor.current = token;
        verifyEmailApi(token)
            .then((res) => { setMessage(res.message || ""); setStatus("success"); })
            .catch((err) => {
                const msg = getErrorMessage(err);
                // "already verified" is a good outcome for the user
                if (/already verified/i.test(msg)) { setMessage(msg); setStatus("success"); }
                else { setMessage(msg); setStatus("error"); }
            });
    }, [token]);

    const titles = { verifying: "Verifying your email...", success: "Email verified", error: "Verification failed" };
    const subtitles = {
        verifying: "This will just take a moment.",
        success: message || "Your account is now active.",
        error: message || "This link may be expired or invalid.",
    };

    return (
        <AuthLayout title={titles[status]} subtitle={subtitles[status]}>
            {status === "success" && (
                <Link to="/login" className="inline-block text-sm font-semibold text-leaf hover:text-forest hover:underline">Continue to login →</Link>
            )}
            {status === "error" && (
                <Link to="/resend-verification" className="inline-block text-sm font-semibold text-leaf hover:text-forest hover:underline">Resend verification email →</Link>
            )}
        </AuthLayout>
    );
}
