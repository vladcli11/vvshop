import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Apple from "./pages/Apple";
import Samsung from "./pages/Samsung";
import Model from "./pages/Models";
import AuthPage from "./pages/AuthPage";
import Register_Form from "./components/RegisterForm";
import { useEffect } from "react";
import { fetchAccessoriesByModel } from "./utils/fetchAccessoriesByModel";
import PrivateRoute from "./components/PrivateRoute";
import Checkout from "./pages/Checkout";
import Huawei from "./pages/Huawei";
import Delivery from "./pages/Delivery";

function App() {
  //  Preloading imagini din Firebase
  useEffect(() => {
    async function preloadImages() {
      try {
        const items = await fetchAccessoriesByModel("all"); // vezi nota de mai jos
        items.forEach((item) => {
          const img = new Image();
          img.src = item.imagine;
        });
        console.log("Imagini preîncărcate:", items.length);
      } catch (err) {
        console.error("Eroare preload imagini:", err);
      }
    }

    preloadImages();
  }, []);

  return (
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
    </Routes>
  );
}

export default App;
