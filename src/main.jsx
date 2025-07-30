import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider";
import { CartProvider } from "./context/CartContext";
import "./index.css";

Sentry.init({
  dsn: "https://6815945bb236b49e7e3dc67e5229cb0e@o4509756636397568.ingest.de.sentry.io/4509756638167120",
  sendDefaultPii: true,
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
