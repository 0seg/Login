import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSwitch = (toLogin) => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsLogin(toLogin);
            setIsAnimating(false);
        }, 300);
    };

    const handleLoginSuccess = (data) => {
        setUser(data);
        alert("¡Login exitoso!");
    };

    const handleRegisterSuccess = () => {
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        handleSwitch(true);
    };

    return (
        <div className="app">
            {}
            <div className="particles">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="particle" />
                ))}
            </div>
            
            <div className={`form-container ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                {isLogin ? (
                    <Login
                        onSwitch={() => handleSwitch(false)}
                        onSuccess={handleLoginSuccess}
                    />
                ) : (
                    <Register
                        onSwitch={() => handleSwitch(true)}
                        onSuccess={handleRegisterSuccess}
                    />
                )}
            </div>
        </div>
    );
}

export default App;