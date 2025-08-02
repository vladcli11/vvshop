import { useState, lazy, Suspense } from "react";

const LoginForm = lazy(() => import("./LoginForm"));
const RegisterForm = lazy(() => import("./RegisterForm"));

function AuthModal({ isOpen, onClose, initialMode = "login", redirectTo }) {
  const [authMode, setAuthMode] = useState(initialMode);

  if (!isOpen) return null;

  const toggleMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="relative bg-white/90 backdrop-blur-xl border border-green-100 rounded-2xl shadow-2xl w-11/12 max-w-md p-4 sm:p-8 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-gray-400 hover:text-red-500 transition"
          aria-label="Închide"
        >
          ×
        </button>
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
            {authMode === "login" ? "Autentificare" : "Înregistrare"}
          </h2>
        </div>
        <Suspense fallback={<div>Se încarcă formularul...</div>}>
          {authMode === "login" ? (
            <LoginForm onClose={onClose} redirectTo={redirectTo} />
          ) : (
            <RegisterForm onClose={onClose} redirectTo={redirectTo} />
          )}
        </Suspense>
        <div className="mt-6 text-center text-sm">
          {authMode === "login" ? (
            <>
              Nu ai cont?{" "}
              <button
                onClick={toggleMode}
                className="text-gray-800 font-semibold underline underline-offset-2 hover:text-gray-900 transition"
              >
                Înregistrează-te
              </button>
            </>
          ) : (
            <>
              Ai deja cont?{" "}
              <button
                onClick={toggleMode}
                className="text-gray-800 font-semibold underline underline-offset-2 hover:text-gray-900 transition"
              >
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
