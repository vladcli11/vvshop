import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Apple from "./pages/Apple";
import Samsung from "./pages/Samsung";
import Huawei from "./pages/Huawei";
import Model from "./pages/Models";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";
import { fetchAccessoriesByModel } from "./utils/fetchAccessoriesByModel";
import PrivateRoute from "./components/PrivateRoute";

const Checkout = lazy(() => import("./pages/Checkout"));
const Contact = lazy(() => import("./pages/Contact"));
const Termeni = lazy(() => import("./pages/Termeni"));
const Confidentialitate = lazy(() => import("./pages/Confidentialitate"));
const LivrareRetur = lazy(() => import("./pages/LivrareRetur"));
const Succes = lazy(() => import("./pages/Succes"));
const Anulare = lazy(() => import("./pages/Anulare"));
const Delivery = lazy(() => import("./pages/Delivery"));
const UserOrders = lazy(() => import("./pages/UserOrders"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const AuthModal = lazy(() => import("./components/AuthModal"));

function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function preloadImages() {
      try {
        const items = await fetchAccessoriesByModel("all");
        items.forEach((item) => {
          if (Array.isArray(item.imagine)) {
            item.imagine.forEach((url) => {
              const img = new Image();
              img.src = url;
            });
          } else {
            const img = new Image();
            img.src = item.imagine;
          }
        });
      } catch (err) {
        console.error("Eroare preload imagini:", err);
      }
    }

    preloadImages();
  }, []);

  return (
    <>
      <Header onAuthClick={() => setShowModal(true)} />
      <Suspense fallback={<div>Se încarcă...</div>}>
        <Routes>
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
          <Route path="/confidentialitate" element={<Confidentialitate />} />
          <Route path="/livrare-retur" element={<LivrareRetur />} />
          <Route path="/succes" element={<Succes />} />
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
      </Suspense>

      {showModal && (
        <Suspense fallback={<div>Se încarcă autentificarea...</div>}>
          <AuthModal isOpen={true} onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </>
  );
}

export default App;
