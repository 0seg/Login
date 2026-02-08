import { FC } from "react";
import "../styles/Loading.css";

const Loading: FC = () => {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Verificando sesión...</p>
    </div>
  );
};

export default Loading;
