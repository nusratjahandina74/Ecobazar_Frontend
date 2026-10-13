import { RouterProvider } from "react-router";
import router from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { CatalogProvider } from "./context/CatalogContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <AuthProvider>
                    <CatalogProvider>
                        <CartProvider>
                            <WishlistProvider>
                                <RouterProvider router={router} />
                            </WishlistProvider>
                        </CartProvider>
                    </CatalogProvider>
                </AuthProvider>
            </ToastProvider>
        </ErrorBoundary>
    );
}
