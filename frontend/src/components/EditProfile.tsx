import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import "../styles/EditProfile.css";

const EditProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState<{ username?: string; email?: string }>(
    {},
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: { username?: string; email?: string } = {};

    if (!formData.username.trim() || formData.username.length < 3) {
      newErrors.username = "Username: mínimo 3 caracteres";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.put("/me", {
        username: formData.username,
        email: formData.email,
      });
      setIsEditing(false);
      window.location.reload();
    } catch (err: any) {
      setErrors({
        username: err.response?.data?.detail || "Error al actualizar",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="edit-profile-view">
        <div className="profile-display">
          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="info-item">
              <label>Nombre de Usuario</label>
              <p>{user?.username}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setIsEditing(true)}>
          ✏️ Editar Perfil
        </button>
      </div>
    );
  }

  return (
    <div className="edit-profile-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>👤 Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Tu nombre de usuario"
            disabled={loading}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>📧 Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            disabled={loading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "⏳ Guardando..." : "💾 Guardar Cambios"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsEditing(false)}
            disabled={loading}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
