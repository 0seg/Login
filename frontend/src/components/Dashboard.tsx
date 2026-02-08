import { FC, useState } from "react";
import "../styles/Dashboard.css";
import { User } from "../types";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onGoToSettings: () => void;
}

const Dashboard: FC<DashboardProps> = ({ user, onLogout, onGoToSettings }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = (): void => {
    setIsLoggingOut(true);
    setTimeout(() => {
      onLogout();
    }, 300);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-navbar">
        <h1 className="navbar-title">Mi Perfil</h1>
        <button
          className="settings-btn"
          onClick={onGoToSettings}
          title="Ir a configuración"
        >
          ⚙️
        </button>
      </div>

      <div className="dashboard-content">
        <div
          className={`dashboard-container ${isLoggingOut ? "fade-out" : "fade-in"}`}
        >
          <div className="user-card">
            <div className="card-header">
              <div className="avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h2>{user?.username}</h2>
                <p className="email">{user?.email}</p>
              </div>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <span className="label">Estado</span>
                <span className="value">
                  {user?.is_active ? (
                    <span className="badge active">✓ Activo</span>
                  ) : (
                    <span className="badge inactive">✗ Inactivo</span>
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Miembro desde</span>
                <span className="value">{formatDate(user?.created_at)}</span>
              </div>
              <div className="detail-item">
                <span className="label">ID Usuario</span>
                <span className="value code">{user?.id}</span>
              </div>
            </div>
          </div>

          <div className="card-actions">
            <button className="logout-btn" onClick={handleLogout}>
              {isLoggingOut ? "Cerrando sesión..." : "🚪 Cerrar Sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
