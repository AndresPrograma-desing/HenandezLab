const SOLO_LETRAS_RE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const CEDULA_RE = /^[VEve]-?\d{6,9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateNombre = (value, label = 'Este campo') => {
  if (!value || !value.trim()) return `${label} es obligatorio.`;
  if (!SOLO_LETRAS_RE.test(value.trim())) return `${label} solo puede contener letras.`;
  return null;
};

export const validateCedula = (value) => {
  if (!value || !value.trim()) return 'La cédula es obligatoria.';
  if (!CEDULA_RE.test(value.trim())) return 'Formato de cédula inválido (ej: V12345678).';
  return null;
};

export const validateEmail = (value) => {
  if (!value || !value.trim()) return 'El correo es obligatorio.';
  if (!EMAIL_RE.test(value.trim())) return 'Formato de correo inválido.';
  return null;
};

export const validatePassword = (value) => {
  if (!value) return 'La contraseña es obligatoria.';
  if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  return null;
};

export const validateGenero = (value) => {
  if (value !== 'M' && value !== 'F') return 'Selecciona un género válido (M o F).';
  return null;
};

export const validateFecha = (value, { noFuture = false, noPast = false } = {}) => {
  if (!value) return 'La fecha es obligatoria.';

  const fecha = new Date(value);
  if (Number.isNaN(fecha.getTime())) return 'Fecha inválida.';

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (noFuture && fecha > hoy) return 'La fecha no puede ser futura.';
  if (noPast && fecha < hoy) return 'La fecha no puede ser anterior a hoy.';
  return null;
};

export const validateRequerido = (value, label = 'Este campo') => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return `${label} es obligatorio.`;
  }
  return null;
};

export const validateNumero = (value, label = 'Este campo', { min, exclusiveMin } = {}) => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return `${label} es obligatorio.`;
  }
  const numero = Number(value);
  if (Number.isNaN(numero)) return `${label} debe ser un número.`;
  if (min !== undefined && numero < min) return `${label} no puede ser menor a ${min}.`;
  if (exclusiveMin !== undefined && numero <= exclusiveMin) return `${label} debe ser mayor a ${exclusiveMin}.`;
  return null;
};
