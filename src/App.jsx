import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import FavoritesProvider from "./context/FavoritesProvider";

// Lazy imports
const Home = lazy(() => import("./pages/Home"));
const Apple = lazy(() => import("./pages/Apple"));
const Samsung = lazy(() => import("./pages/Samsung"));
const Huawei = lazy(() => import("./pages/Huawei"));
const Model = lazy(() => import("./pages/Models"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Contact = lazy(() => import("./pages/Contact"));
const Termeni = lazy(() => import("./pages/Termeni"));
const Confidentialitate = lazy(() => import("./pages/Confidentialitate"));
const LivrareRetur = lazy(() => import("./pages/LivrareRetur"));
const Anulare = lazy(() => import("./pages/Anulare"));
const Delivery = lazy(() => import("./pages/Delivery"));
const UserOrders = lazy(() => import("./pages/UserOrders"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const AuthModal = lazy(() => import("./components/AuthModal"));

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const location = useLocation();

  // deschide modalul din alte componente (event global)
  useEffect(() => {
    const handle = (e) => {
      setAuthMode(e.detail === "register" ? "register" : "login");
      setShowAuthModal(true);
    };
    window.addEventListener("open-auth-modal", handle);
    return () => window.removeEventListener("open-auth-modal", handle);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onAuthClick={() => {
          setAuthMode("login");
          setShowAuthModal(true);
        }}
      />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-4 text-center text-gray-500">
              Se încarcă pagina...
            </div>
          }
        >
          <FavoritesProvider>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/apple" element={<Apple />} />
              <Route path="/samsung" element={<Samsung />} />
              <Route path="/huawei" element={<Huawei />} />
              <Route path="/apple/:slug" element={<Model />} />
              <Route path="/samsung/:slug" element={<Model />} />
              <Route path="/huawei/:slug" element={<Model />} />
              <Route path="/cos" element={<Checkout />} />
              <Route path="/cos/livrare" element={<Delivery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/termeni" element={<Termeni />} />
              <Route
                path="/confidentialitate"
                element={<Confidentialitate />}
              />
              <Route path="/livrare-retur" element={<LivrareRetur />} />
              <Route path="/anulare" element={<Anulare />} />
              <Route path="/produs/:slug" element={<ProductPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="/contul-meu"
                element={
                  <PrivateRoute>
                    <UserOrders />
                  </PrivateRoute>
                }
              />
            </Routes>
          </FavoritesProvider>
        </Suspense>
      </main>
      <Footer />
      {showAuthModal && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={true}
            onClose={() => setShowAuthModal(false)}
            initialMode={authMode}
            redirectTo={null}
          />
        </Suspense>
      )}
    </div>
  );
}
