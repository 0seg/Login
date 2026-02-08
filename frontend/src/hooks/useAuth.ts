import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../api";
import { User } from "../types";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchCurrentUser(token);
        setUser(userData);
        setError(null);
      } catch (err) {
        localStorage.removeItem("token");
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (userData: User, token: string): void => {
    setUser(userData);
    localStorage.setItem("token", token);
    setError(null);
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("token");
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user && !!localStorage.getItem("token"),
  };
}
