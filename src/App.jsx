import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Apple from "./pages/Apple";
import Samsung from "./pages/Samsung";
import Model from "./pages/Models";
import AuthPage from "./pages/AuthPage";
import Register_Form from "./components/RegisterForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/apple" element={<Apple />} />
      <Route path="/samsung" element={<Samsung />} />
      <Route path="/apple/:slug" element={<Model />} />
      <Route path="/samsung/:slug" element={<Model />} />
      <Route path="register" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
