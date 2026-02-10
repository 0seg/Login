import { useState } from "react";
import { login, fetchCurrentUser } from "../api";
import { User } from "../types";
import "../App.css";

interface LoginProps {
  onSwitch: () => void;
  onSuccess: (
    userData: User,
    accessToken: string,
    refreshToken: string,
  ) => void;
}

const Login: React.FC<LoginProps> = ({ onSwitch, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const validateUsername = (value: string): void => {
    setEmailValid(value.length >= 3 ? true : value === "" ? null : false);
  };

  const handleUsernameChange = (value: string): void => {
    setUsername(value);
    validateUsername(value);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tokenData = await login(username, password);
      localStorage.setItem("accessToken", tokenData.access_token);
      localStorage.setItem("refreshToken", tokenData.refresh_token);

      const userData = await fetchCurrentUser(tokenData.access_token);
      onSuccess(userData, tokenData.access_token, tokenData.refresh_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">🔐</div>
      <h2>Bienvenido</h2>
      <p className="subtitle">Ingresa a tu cuenta para continuar</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>👤 Usuario</label>
          <div className="input-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="tu_usuario"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
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
          <label>🔒 Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Iniciando...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>
      <p>
        ¿No tienes cuenta?{" "}
        <span className="link" onClick={onSwitch}>
          Crear cuenta
        </span>
      </p>
    </div>
  );
};

export default Login;
