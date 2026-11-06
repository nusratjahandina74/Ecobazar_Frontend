import { lazy } from "react";
import { createBrowserRouter } from "react-router";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AccountLayout from "../layouts/AccountLayout";

// Common
import ProtectedRoute from "../components/common/ProtectedRoute";
import { ANY_ACCOUNT } from "../utils/constants";

// Customer pages
import Home from "../pages/customer/Home";
const ProductListing = lazy(() => import("../pages/customer/ProductListing"));
const ProductDetails = lazy(() => import("../pages/customer/ProductDetails"));
const Wishlist = lazy(() => import("../pages/customer/Wishlist"));
const Cart = lazy(() => import("../pages/customer/Cart"));
const Checkout = lazy(() => import("../pages/customer/Checkout"));
const OrderSuccess = lazy(() => import("../pages/customer/OrderSuccess"));
const OrderFailed = lazy(() => import("../pages/customer/OrderFailed"));
const MyOrders = lazy(() => import("../pages/customer/MyOrders"));
const Contact = lazy(() => import("../pages/customer/Contact"));
const TrackOrder = lazy(() => import("../pages/customer/TrackOrder"));
const CmsPage = lazy(() => import("../pages/customer/CmsPage"));
const Profile = lazy(() => import("../pages/customer/Profile"));

// Auth pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const ResendVerification = lazy(() => import("../pages/auth/ResendVerification"));

// Fallback
const NotFound = lazy(() => import("../pages/NotFound"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "products", element: <ProductListing /> },
            { path: "products/:id", element: <ProductDetails /> },
            { path: "contact", element: <Contact /> },
            { path: "track-order", element: <TrackOrder /> },
            { path: "page/:slug", element: <CmsPage /> },
            { path: "wishlist", element: <ProtectedRoute allowedRoles={ANY_ACCOUNT}><Wishlist /></ProtectedRoute> },
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