import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Apple from "./pages/Apple";
import Samsung from "./pages/Samsung";
import Model from "./pages/Models";
import AuthPage from "./pages/AuthPage";

import { fetchAccessoriesByModel } from "./utils/fetchAccessoriesByModel";
import PrivateRoute from "./components/PrivateRoute";
import Checkout from "./pages/Checkout";
import Huawei from "./pages/Huawei";
import Delivery from "./pages/Delivery";
import Succes from "./pages/Succes";
import Anulare from "./pages/Anulare";
import Contact from "./pages/Contact";
import Termeni from "./pages/Termeni";
import Confidentialitate from "./pages/Confidentialitate";
import LivrareRetur from "./pages/LivrareRetur";
import UserOrders from "./pages/UserOrders";
import AdminDashboard from "./pages/AdminDashboard";
import ProductPage from "./pages/ProductPage";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";

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
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/apple" element={<Apple />} />
        <Route path="/samsung" element={<Samsung />} />
        <Route path="/apple/:slug" element={<Model />} />
        <Route path="/samsung/:slug" element={<Model />} />
        <Route path="/cos" element={<Checkout />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/huawei" element={<Huawei />} />
        <Route path="/huawei/:slug" element={<Model />} />
        <Route path="/cos/livrare" element={<Delivery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/succes" element={<Succes />} />
        <Route path="/anulare" element={<Anulare />} />
        <Route path="/termeni" element={<Termeni />} />
        <Route path="/produs/:slug" element={<ProductPage />} />
        <Route path="/confidentialitate" element={<Confidentialitate />} />
        <Route path="/livrare-retur" element={<LivrareRetur />} />
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
      {showModal && (
        <AuthModal isOpen={true} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default App;
