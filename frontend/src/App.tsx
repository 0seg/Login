import { FC, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useToast } from "./hooks/useToast";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import ResetPassword from "./components/ResetPassword";
import Loading from "./components/Loading";
import Toast from "./components/Toast";
import { User } from "./types";
import "./App.css";

type AppPage = "auth" | "dashboard" | "settings" | "reset";

const App: FC = () => {
  // ✅ PRIMERO: Todos los hooks ANTES de cualquier condicional
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>("auth");
  const { toasts, addToast, removeToast } = useToast();

  // ✅ SEGUNDO: Now you can use conditionals
  if (loading) {
    return <Loading />;
  }

  // Cuando carga, si está autenticado y currentPage es 'auth', ir al dashboard
  if (isAuthenticated && currentPage === "auth") {
    setCurrentPage("dashboard");
  }

  const handleSwitch = (toLogin: boolean): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(toLogin);
      setIsAnimating(false);
    }, 300);
  };

  const handleLoginSuccess = (
    userData: User,
    accessToken: string,
    refreshToken: string,
  ): void => {
    login(userData, accessToken, refreshToken);
    addToast("¡Sesión iniciada exitosamente!", "success", 2000);
    setCurrentPage("dashboard");
  };

  const handleRegisterSuccess = (): void => {
    addToast("¡Cuenta creada! Inicia sesión ahora.", "success", 3000);
    handleSwitch(true);
  };

  const handleLogout = (): void => {
    logout();
    setIsLogin(true);
    setCurrentPage("auth");
    addToast("Sesión cerrada", "info", 2000);
  };

  return (
    <>
      {isAuthenticated && user ? (
        <>
          {currentPage === "dashboard" && (
            <Dashboard
              user={user}
              onLogout={handleLogout}
              onGoToSettings={() => setCurrentPage("settings")}
            />
          )}
          {currentPage === "settings" && (
            <Settings
              onLogout={handleLogout}
              onGoBack={() => setCurrentPage("dashboard")}
            />
          )}
        </>
      ) : (
        <>
          {currentPage === "auth" && (
            <div className="app">
              <div className="particles">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="particle" />
                ))}
              </div>

              <div
                className={`form-container ${
                  isAnimating ? "fade-out" : "fade-in"
                }`}
              >
                {isLogin ? (
                  <Login
                    onSwitch={() => handleSwitch(false)}
                    onSuccess={handleLoginSuccess}
                  />
                ) : (
                  <Register
                    onSwitch={() => handleSwitch(true)}
                    onSuccess={handleRegisterSuccess}
                  />
                )}
              </div>

              <button
                className="reset-password-link"
                onClick={() => setCurrentPage("reset")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}
          {currentPage === "reset" && (
            <ResetPassword
              onGoBack={() => setCurrentPage("auth")}
              addToast={addToast}
            />
          )}
        </>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default App;
