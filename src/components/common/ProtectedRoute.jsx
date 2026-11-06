import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "./Loader";
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
