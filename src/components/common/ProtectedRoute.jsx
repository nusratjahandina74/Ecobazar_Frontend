import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "./Loader";

// allowedRoles: backend roles permitted (see utils/constants.js). The role comes from the server
// (GET /me), never from localStorage. This is UX only — every API route re-checks it server-side.
export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, booting, isAuthenticated } = useAuth();
    const location = useLocation();

    if (booting) return <PageLoader />;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    return children;
}
