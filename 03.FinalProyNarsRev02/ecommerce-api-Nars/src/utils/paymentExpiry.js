export const EXPIRY_DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;

export const normalizeExpiryDate = (value) => {
  if (typeof value !== 'string') return value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return trimmedValue;
  if (EXPIRY_DATE_REGEX.test(trimmedValue)) return trimmedValue;

  const digitsOnly = trimmedValue.replace(/\D/g, '');

  if (digitsOnly.length === 4) {
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
  }

  return trimmedValue;
};

export const isValidExpiryDate = (value) => typeof value === 'string' && EXPIRY_DATE_REGEX.test(value);
