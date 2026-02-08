import { useState } from "react";
import { api } from "../api";
import "../styles/ChangePassword.css";

const ChangePassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.current_password) {
      newErrors.current_password = "Contraseña actual requerida";
    }

    if (!formData.new_password || formData.new_password.length < 6) {
      newErrors.new_password = "Mínimo 6 caracteres";
    }

    if (formData.new_password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (formData.current_password === formData.new_password) {
      newErrors.new_password = "Debe ser diferente a la actual";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("/change-password", {
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      setSuccess("✓ Contraseña actualizada exitosamente");
      setFormData({
        current_password: "",
        new_password: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setErrors({
        current_password:
          err.response?.data?.detail || "Error al cambiar contraseña",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label>🔐 Contraseña Actual</label>
          <div className="password-input-group">
            <input
              type={showPasswords.current ? "text" : "password"}
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña actual"
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  current: !prev.current,
                }))
              }
            >
              {showPasswords.current ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.current_password && (
            <span className="error">{errors.current_password}</span>
          )}
        </div>

        <div className="form-group">
          <label>🆕 Nueva Contraseña</label>
          <div className="password-input-group">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              placeholder="Nueva contraseña"
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  new: !prev.new,
                }))
              }
            >
              {showPasswords.new ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.new_password && (
            <span className="error">{errors.new_password}</span>
          )}
        </div>

        <div className="form-group">
          <label>✓ Confirmar Nueva Contraseña</label>
          <div className="password-input-group">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma la nueva contraseña"
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
            >
              {showPasswords.confirm ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        {success && <div className="success-box">{success}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "⏳ Actualizando..." : "🔒 Actualizar Contraseña"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
