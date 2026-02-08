import { useState, useCallback } from "react";
import { Toast } from "../types";

interface UseToastReturn {
  toasts: Toast[];
  addToast: (
    message: string,
    type: "success" | "error" | "info" | "warning",
    duration?: number,
  ) => number;
  removeToast: (id: number) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "info",
      duration = 3000,
    ): number => {
      const id = Date.now();
      const toast: Toast = { id, message, type };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [],
  );

  const removeToast = useCallback((id: number): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
