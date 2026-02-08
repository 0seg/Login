import { useState } from "react";
import { api } from "../api";
import "../styles/ResetPassword.css";

type Step = "email" | "token" | "newPassword" | "success";

const ResetPassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email || !email.includes("@")) {
      setErrors({ email: "Email inválido" });
      return;
    }

    setLoading(true);
    try {
      await api.post("/forgot-password", { email });
      setCurrentStep("token");
    } catch (err: any) {
      setErrors({
        email: err.response?.data?.detail || "Error al solicitar reset",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};

    if (!resetToken) {
      newErrors.token = "Token requerido";
    }

    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = "Mínimo 6 caracteres";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post("/reset-password", {
        token: resetToken,
        new_password: newPassword,
      });
      setCurrentStep("success");
    } catch (err: any) {
      setErrors({
        newPassword:
          err.response?.data?.detail || "Error al resetear contraseña",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-card">
        <h2>🔐 Recuperar Contraseña</h2>

        {currentStep === "email" && (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label>Ingresa tu Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                placeholder="tu@email.com"
                disabled={loading}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "📧 Enviar Token"}
            </button>
            <p className="hint">
              Recibirás un token de recuperación en tu email
            </p>
          </form>
        )}

        {currentStep === "token" && (
          <form onSubmit={() => setCurrentStep("newPassword")}>
            <div className="form-group">
              <label>Ingresa el Token</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => {
                  setResetToken(e.target.value);
                  setErrors({});
                }}
                placeholder="Token de recuperación"
              />
              {errors.token && <span className="error">{errors.token}</span>}
              <p className="hint">Token de prueba en la consola del servidor</p>
            </div>
            <button type="submit">↪️ Continuar</button>
          </form>
        )}

        {currentStep === "newPassword" && (
          <form onSubmit={handlePasswordReset}>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <div className="password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors({});
                  }}
                  placeholder="Nueva contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.newPassword && (
                <span className="error">{errors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({});
                }}
                placeholder="Confirma la contraseña"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Reseteando..." : "🔄 Resetear Contraseña"}
            </button>
          </form>
        )}

        {currentStep === "success" && (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h3>¡Contraseña Actualizada!</h3>
            <p>Tu contraseña ha sido reseteada correctamente.</p>
            <p>Ahora puedes iniciar sesión con tu nueva contraseña.</p>
            <a href="/" className="home-link">
              ← Volver a Inicio de Sesión
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
