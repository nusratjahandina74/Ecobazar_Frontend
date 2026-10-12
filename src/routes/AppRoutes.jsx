import { createBrowserRouter } from "react-router";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AccountLayout from "../layouts/AccountLayout";
import AdminLayout from "../layouts/AdminLayout";

// Common
import ProtectedRoute from "../components/common/ProtectedRoute";
import { ANY_ACCOUNT, ADMIN_PANEL_ROLES, ADMIN_ONLY } from "../utils/constants";

// Customer pages
import Home from "../pages/customer/Home";
import ProductListing from "../pages/customer/ProductListing";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderSuccess from "../pages/customer/OrderSuccess";
import OrderFailed from "../pages/customer/OrderFailed";
import MyOrders from "../pages/customer/MyOrders";
import Profile from "../pages/customer/Profile";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResendVerification from "../pages/auth/ResendVerification";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import ManageProducts from "../pages/admin/ManageProducts";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import ManageUsers from "../pages/admin/ManageUsers";
import UserDetails from "../pages/admin/UserDetails";
import ManageOrders from "../pages/admin/ManageOrders";

// Fallback
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "products", element: <ProductListing /> },
            { path: "products/:id", element: <ProductDetails /> },
            // Cart needs a signed-in user (the backend cart belongs to a real user id)
            { path: "cart", element: <ProtectedRoute allowedRoles={ANY_ACCOUNT}><Cart /></ProtectedRoute> },
            { path: "checkout", element: <ProtectedRoute allowedRoles={ANY_ACCOUNT}><Checkout /></ProtectedRoute> },
            { path: "order-success", element: <ProtectedRoute allowedRoles={ANY_ACCOUNT}><OrderSuccess /></ProtectedRoute> },
            { path: "order-failed", element: <OrderFailed /> },

            // Account section — any logged-in role can access
            {
                path: "",
                element: (
                    <ProtectedRoute allowedRoles={ANY_ACCOUNT}>
                        <AccountLayout />
                    </ProtectedRoute>
                ),
                children: [
                    { path: "profile", element: <Profile /> },
                    { path: "my-orders", element: <MyOrders /> },
                ],
            },

            { path: "*", element: <NotFound /> },
        ],
    },

    // Admin panel: backend roles admin / editor / vendor. Users + Orders are admin-only (same rules enforced by the API).
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={ADMIN_PANEL_ROLES}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: "products", element: <ManageProducts /> },
            { path: "products/create", element: <AddProduct /> },
            { path: "products/edit/:id", element: <EditProduct /> },
            {
                path: "users",
                element: (
                    <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                        <ManageUsers />
                    </ProtectedRoute>
                ),
            },
            {
                path: "users/:id",
                element: (
                    <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                        <UserDetails />
                    </ProtectedRoute>
                ),
            },
            { path: "orders", element: <ProtectedRoute allowedRoles={ADMIN_ONLY}><ManageOrders /></ProtectedRoute> },
            { path: "*", element: <NotFound /> },
        ],
    },

    // Auth pages — full-screen split layout, no Navbar/Footer
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verifyemail/:token", element: <VerifyEmail /> },
    { path: "/resetpassword/:token", element: <ResetPassword /> },
    { path: "/verify-email/:token", element: <VerifyEmail /> },
    { path: "/resend-verification", element: <ResendVerification /> },
    { path: "/reset-password/:token", element: <ResetPassword /> },
]);

export default router;