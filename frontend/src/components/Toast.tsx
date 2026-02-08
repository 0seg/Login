import { FC } from "react";
import { Toast as ToastType } from "../types";
import "../styles/Toast.css";

interface ToastProps {
  toasts: ToastType[];
  onRemove: (id: number) => void;
}

const Toast: FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => onRemove(toast.id)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
