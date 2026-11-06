import { Suspense } from "react";
import { RouterProvider } from "react-router";
import router from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { CatalogProvider } from "./context/CatalogContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <SettingsProvider>
                <AuthProvider>
                    <CatalogProvider>
                        <CartProvider>
                            <WishlistProvider>
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-gray-500" role="status">Loading...</div>}>
                                    <RouterProvider router={router} />
                                </Suspense>
                            </WishlistProvider>
                        </CartProvider>
                    </CatalogProvider>
                </AuthProvider>
                </SettingsProvider>
            </ToastProvider>
        </ErrorBoundary>
    );
}
