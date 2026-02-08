export const API_URL = "/api";

export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Email inválido",
  WEAK_PASSWORD: "Contraseña insuficientemente fuerte",
  SHORT_USERNAME: "Username debe tener al menos 3 caracteres",
  REQUIRED_FIELD: "Este campo es requerido",
  EMAIL_EXISTS: "Este email ya está registrado",
  USERNAME_EXISTS: "Este username ya está registrado",
  INVALID_CREDENTIALS: "Email o contraseña incorrectos",
  NETWORK_ERROR: "Error de conexión. Intenta de nuevo.",
  UNEXPECTED_ERROR: "Algo salió mal. Intenta de nuevo.",
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "¡Sesión iniciada exitosamente!",
  REGISTER_SUCCESS: "¡Cuenta creada exitosamente!",
  LOGOUT_SUCCESS: "¡Sesión cerrada!",
} as const;

export const TOAST_DURATION = 3000;

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRES_UPPERCASE: true,
  REQUIRES_LOWERCASE: true,
  REQUIRES_NUMBER: true,
  REQUIRES_SPECIAL: true,
} as const;
