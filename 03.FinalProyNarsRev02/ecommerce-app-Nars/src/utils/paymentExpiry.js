export const EXPIRY_DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;

export const normalizeExpiryDateInput = (value) => {
  if (typeof value !== "string") return "";

  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) return digits;

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const isValidExpiryDate = (value) => EXPIRY_DATE_REGEX.test(value);
