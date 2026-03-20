import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { SiteHeader } from "./components/organisms/SiteHeader";
import { PrivateRoute } from "./components/organisms/PrivateRoute";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app-root">
            <SiteHeader />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <OrdersPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <PrivateRoute>
                    <OrderDetailPage />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
