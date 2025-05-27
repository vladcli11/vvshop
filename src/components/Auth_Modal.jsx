import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthModal({ isOpen, onClose }) {
  const [authMode, setAuthMode] = useState("login");

  if (!isOpen) return null;

  const toggleMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl">
          ✖
        </button>

        {authMode === "login" ? (
          <LoginForm onClose={onClose} />
        ) : (
          <RegisterForm onClose={onClose} />
        )}

        <div className="mt-4 text-center text-sm">
          {authMode === "login" ? (
            <>
              Nu ai cont?{" "}
              <button onClick={toggleMode} className="text-blue-600 underline">
                Înregistrează-te
              </button>
            </>
          ) : (
            <>
              Ai deja cont?{" "}
              <button onClick={toggleMode} className="text-blue-600 underline">
                Autentifică-te
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
