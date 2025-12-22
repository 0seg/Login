import { useState } from "react";
import { register } from "../api";

function Register({ onSwitch, onSuccess }) {
    const [username, setUsername] = useState("");
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

    const getPasswordStrength = () => {
        if (password.length === 0) return null;
        if (password.length < 6) return { level: 1, text: "Débil", color: "#ef4444" };
        if (password.length < 10) {
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[!@#$%^&*]/.test(password);
            if (hasNumber || hasSpecial) return { level: 2, text: "Media", color: "#f59e0b" };
            return { level: 1, text: "Débil", color: "#ef4444" };
        }
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        if (hasNumber && hasSpecial && hasUpper) return { level: 3, text: "Fuerte", color: "#22c55e" };
        if (hasNumber || hasSpecial) return { level: 2, text: "Media", color: "#f59e0b" };
        return { level: 2, text: "Media", color: "#f59e0b" };
    };

    const passwordStrength = getPasswordStrength();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await register(username, email, password);
            onSuccess();
        } catch (err) {
            setError(err.message);
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
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {passwordStrength && (
                        <div className="password-strength">
                            <div className="strength-bars">
                                {[1, 2, 3].map((level) => (
                                    <div
                                        key={level}
                                        className={`strength-bar ${level <= passwordStrength.level ? "active" : ""}`}
                                        style={{ backgroundColor: level <= passwordStrength.level ? passwordStrength.color : "" }}
                                    />
                                ))}
                            </div>
                            <span className="strength-text" style={{ color: passwordStrength.color }}>
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
                            Creando...
                        </>
                    ) : (
                        "Crear Cuenta"
                    )}
                </button>
            </form>
            <p>
                ¿Ya tienes cuenta?{" "}
                <span className="link" onClick={onSwitch}>
                    Iniciar sesión
                </span>
            </p>
        </div>
    );
}

export default Register;
