import { useState } from "react";
import { login } from "../api";

function Login({ onSwitch, onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailValid, setEmailValid] = useState(null);

    const validateEmail = (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(value === "" ? null : regex.test(value));
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.access_token);
            onSuccess(data);
        } catch (err) {
            setError(err.message);
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
                    <label>Email</label>
                    <div className="input-wrapper">
                        <span className="input-icon">📧</span>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={handleEmailChange}
                            className={emailValid === false ? "invalid" : emailValid === true ? "valid" : ""}
                            required
                        />
                        {emailValid !== null && (
                            <span className={`validation-icon ${emailValid ? "valid" : "invalid"}`}>
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
                            type={showPassword ? "text" : "password"}
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
}

export default Login;
