import { useState } from "react";
import { register } from "../api";
import { getPasswordStrength } from "../utils/validation";
import "../App.css";

interface RegisterProps {
  onSwitch: () => void;
  onSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitch, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const validateEmail = (value: string): void => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(value === "" ? null : regex.test(value));
  };

  const handleEmailChange = (value: string): void => {
    setEmail(value);
    validateEmail(value);
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(username, email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">✨</div>
      <h2>Crear Cuenta</h2>
      <p className="subtitle">Únete y comienza tu experiencia</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Usuario</label>
          <div className="input-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label>Email</label>
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={
                emailValid === false
                  ? "invalid"
                  : emailValid === true
                    ? "valid"
                    : ""
              }
              required
            />
            {emailValid !== null && (
              <span
                className={`validation-icon ${emailValid ? "valid" : "invalid"}`}
              >
                {emailValid ? "✓" : "✗"}
              </span>
            )}
          </div>
        </div>
        <div className="input-group">
          <label>Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Min 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {passwordStrength && (
            <div className="password-strength">
              <div className="strength-bars">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`strength-bar ${i <= passwordStrength.level ? "active" : ""}`}
                  />
                ))}
              </div>
              <span
                className="strength-text"
                style={{ color: passwordStrength.color }}
              >
                {passwordStrength.text}
              </span>
            </div>
          )}
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Registrando...
            </>
          ) : (
            "Crear Cuenta"
          )}
        </button>
      </form>
      <p>
        ¿Ya tienes cuenta?{" "}
        <span className="link" onClick={onSwitch}>
          Inicia sesión
        </span>
      </p>
    </div>
  );
};

export default Register;
