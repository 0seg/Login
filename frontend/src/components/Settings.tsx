import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import "../styles/Settings.css";

interface SettingsProps {
  onLogout: () => void;
  onGoBack?: () => void;
}

type SettingsTab = "profile" | "security" | "account";

const Settings: React.FC<SettingsProps> = ({ onLogout, onGoBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="settings-page">
      <div className="settings-navbar">
        <div className="navbar-content">
          <button
            className="back-button"
            onClick={onGoBack}
            title="Volver al Dashboard"
          >
            ← Dashboard
          </button>
          <h1>⚙️ Configuración</h1>
          <div className="navbar-spacer" />
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-layout">
          <aside className="settings-sidebar">
            <nav className="nav-tabs">
              <button
                className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <span className="tab-icon">👤</span>
                <span className="tab-label">Perfil</span>
              </button>
              <button
                className={`tab-button ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <span className="tab-icon">🔒</span>
                <span className="tab-label">Seguridad</span>
              </button>
              <button
                className={`tab-button ${activeTab === "account" ? "active" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                <span className="tab-icon">🚪</span>
                <span className="tab-label">Cuenta</span>
              </button>
            </nav>
          </aside>

          <main className="settings-content">
            {activeTab === "profile" && user && <EditProfile />}

            {activeTab === "security" && user && <ChangePassword />}

            {activeTab === "account" && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Información de la Cuenta</h2>
                  <p>Detalles y opciones de tu cuenta</p>
                </div>

                <div className="account-info-grid">
                  <div className="info-card">
                    <div className="info-label">ID de Usuario</div>
                    <div className="info-value">{user?.id}</div>
                  </div>
                  <div className="info-card">
                    <div className="info-label">Email</div>
                    <div className="info-value">{user?.email}</div>
                  </div>
                  <div className="info-card">
                    <div className="info-label">Usuario</div>
                    <div className="info-value">{user?.username}</div>
                  </div>
                  <div className="info-card">
                    <div className="info-label">Miembro desde</div>
                    <div className="info-value">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="danger-section">
                  <div className="section-header">
                    <h3>Zona de Peligro</h3>
                    <p>Acciones irreversibles</p>
                  </div>
                  <button className="logout-button" onClick={handleLogout}>
                    <span className="button-icon">🚪</span>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
