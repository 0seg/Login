import { useState } from "react";
import { forgotPassword, resetPassword } from "../api";
import "../styles/ResetPassword.css";

type Step = "email" | "token" | "newPassword" | "success";

interface ResetPasswordProps {
  onGoBack: () => void;
  addToast: (
    message: string,
    type: "success" | "error" | "info" | "warning",
    duration?: number,
  ) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  onGoBack,
  addToast,
}) => {
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
      const response = await forgotPassword(email);
      console.log("Response:", response);
      if (response && response.token) {
        setResetToken(response.token);
        console.log("Token recibido:", response.token);
        addToast(`🔑 Tu token: ${response.token}`, "success", 5000);
        setCurrentStep("token");
      } else {
        addToast("No se recibió token", "error");
      }
    } catch (err: any) {
      console.error("Error:", err);
      addToast(err.detail || "Error al solicitar reset", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    console.log("Token a validar:", resetToken);

    if (!resetToken || resetToken.trim() === "") {
      console.log("Token vacío");
      setErrors({ token: "Token requerido" });
      addToast("⚠️ Ingresa el token", "warning");
      return;
    }

    console.log("Token válido, pasando a nueva contraseña");
    setCurrentStep("newPassword");
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
      await resetPassword(resetToken, newPassword);
      addToast("✅ Contraseña actualizada correctamente", "success", 2000);
      setCurrentStep("success");
    } catch (err: any) {
      addToast(err.detail || "Error al resetear contraseña", "error");
      setErrors({
        newPassword: err.detail || "Error al resetear contraseña",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>🔐 Recuperar Contraseña</h2>
          <button
            onClick={onGoBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "24px",
              padding: "0",
            }}
          >
            ✕
          </button>
        </div>

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
              Recibirás un token de 6 dígitos en un mensaje
            </p>
          </form>
        )}

        {currentStep === "token" && (
          <form onSubmit={handleTokenSubmit}>
            <div className="form-group">
              <label>Verifica el Token</label>
              {resetToken ? (
                <>
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      padding: "15px",
                      borderRadius: "4px",
                      textAlign: "center",
                      fontSize: "32px",
                      letterSpacing: "8px",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      marginBottom: "10px",
                      color: "#000000",
                    }}
                  >
                    {resetToken}
                  </div>
                  <input type="hidden" value={resetToken} />
                </>
              ) : (
                <div style={{ color: "red", padding: "10px" }}>
                  ⚠️ No se recibió token. Intenta de nuevo.
                </div>
              )}
              {errors.token && <span className="error">{errors.token}</span>}
              <p className="hint">
                {resetToken
                  ? "Token recibido. Haz click en Confirmar para continuar."
                  : "Espera un momento..."}
              </p>
            </div>
            <button type="submit" disabled={!resetToken}>
              ✓ Confirmar Token
            </button>
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
            <button
              onClick={onGoBack}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ← Volver a Inicio de Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
