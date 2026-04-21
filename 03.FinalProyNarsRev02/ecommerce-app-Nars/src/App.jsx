import { Suspense, lazy } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { GlobalUIFeedback, UIProvider } from "./contexts/UIContext";
import { queryClient } from "./lib/queryClient";
import { SiteHeader } from "./components/organisms/SiteHeader";
import { PrivateRoute } from "./components/organisms/PrivateRoute";
import { AdminRoute } from "./components/organisms/AdminRoute";
import { GuestOnlyRoute } from "./components/organisms/GuestOnlyRoute";
import { CartPage } from "./pages/CartPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then((module) => ({ default: module.ProductDetailPage })));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage").then((module) => ({ default: module.CheckoutPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then((module) => ({ default: module.ProfilePage })));
const OrdersPage = lazy(() => import("./pages/OrdersPage").then((module) => ({ default: module.OrdersPage })));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage").then((module) => ({ default: module.OrderDetailPage })));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage").then((module) => ({ default: module.AdminProductsPage })));
const AdminCategoriesPage = lazy(() => import("./pages/AdminCategoriesPage").then((module) => ({ default: module.AdminCategoriesPage })));
const WishlistPage = lazy(() => import("./pages/WishlistPage").then((module) => ({ default: module.WishlistPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then((module) => ({ default: module.RegisterPage })));

function RouteFallback() {
  return (
    <main className="page container page--center">
      <p>Cargando página...</p>
    </main>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UIProvider>
            <CartProvider>
              <div className="app-root">
                <SiteHeader />
                <GlobalUIFeedback />
                <Suspense fallback={<RouteFallback />}>
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
                  path="/admin/categories"
                  element={
                    <AdminRoute>
                      <AdminCategoriesPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <AdminProductsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <PrivateRoute>
                      <WishlistPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
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
                <Route
                  path="/login"
                  element={
                    <GuestOnlyRoute>
                      <LoginPage />
                    </GuestOnlyRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <GuestOnlyRoute>
                      <RegisterPage />
                    </GuestOnlyRoute>
                  }
                />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </div>
            </CartProvider>
          </UIProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
