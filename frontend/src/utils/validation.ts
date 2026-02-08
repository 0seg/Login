export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()-_=+[\]{}|;:,.<>?/]/.test(password);
  const hasMinLength = password.length >= 8;

  return hasUpper && hasLower && hasNumber && hasSpecial && hasMinLength;
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 50;
};

interface PasswordStrengthResult {
  level: number;
  text: string;
  color: string;
}

export const getPasswordStrength = (
  password: string,
): PasswordStrengthResult | null => {
  if (password.length === 0) return null;
  if (password.length < 8) return { level: 1, text: "Débil", color: "#ef4444" };

  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const hasUpper = /[A-Z]/.test(password);

  if (hasNumber && hasSpecial && hasUpper) {
    return { level: 3, text: "Fuerte", color: "#22c55e" };
  }
  if (hasNumber || hasSpecial) {
    return { level: 2, text: "Media", color: "#f59e0b" };
  }
  return { level: 1, text: "Débil", color: "#ef4444" };
};
