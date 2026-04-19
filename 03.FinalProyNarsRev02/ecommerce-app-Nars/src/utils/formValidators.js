export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

export const validateLoginForm = ({ email, password }) => {
  if (!isValidEmail(email)) return "Ingresa un correo electrónico válido.";
  if (!password || password.trim().length < 6) return "La contraseña debe tener al menos 6 caracteres.";
  return null;
};

export const validateRegisterForm = ({ name, email, password }) => {
  if (!name || name.trim().length < 2) return "Ingresa un nombre válido de al menos 2 caracteres.";
  if (!isValidEmail(email)) return "Ingresa un correo electrónico válido.";
  if (!password || password.trim().length < 6) return "La contraseña debe tener al menos 6 caracteres.";
  return null;
};

const digitsOnly = (value) => String(value || "").replace(/\D/g, "");

export const validateCheckoutFields = ({
  requiresNewShipping,
  requiresNewPayment,
  allowStoredPaymentNumber,
  name,
  address,
  city,
  state,
  postalCode,
  phone,
  cardNumber,
  cardHolder,
  cardExpiry,
  cardCvv,
  isValidExpiryDate,
}) => {
  if (requiresNewShipping) {
    if (!name || name.trim().length < 2) return "Ingresa un nombre de destinatario válido.";
    if (!address || address.trim().length < 5) return "Ingresa una dirección válida.";
    if (!city || city.trim().length < 2) return "Ingresa una ciudad válida.";
    if (!state || state.trim().length < 2) return "Ingresa un estado válido.";

    const normalizedPostalCode = digitsOnly(postalCode);
    if (normalizedPostalCode.length < 5 || normalizedPostalCode.length > 6) {
      return "Ingresa un código postal válido de 5 o 6 dígitos.";
    }

    const normalizedPhone = digitsOnly(phone);
    if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      return "Ingresa un teléfono válido de 10 a 15 dígitos.";
    }
  }

  if (requiresNewPayment) {
    if (!cardHolder || cardHolder.trim().length < 2) return "Ingresa el nombre del titular de la tarjeta.";

    const normalizedCardNumber = digitsOnly(cardNumber);
    const hasStoredCardReference = allowStoredPaymentNumber && normalizedCardNumber.length === 4;
    if (!hasStoredCardReference && (normalizedCardNumber.length < 13 || normalizedCardNumber.length > 19)) {
      return "Ingresa un número de tarjeta válido.";
    }

    if (!isValidExpiryDate(cardExpiry)) return "Ingresa el vencimiento en formato MM/YY.";

    const normalizedCvv = digitsOnly(cardCvv);
    if (normalizedCvv.length < 3 || normalizedCvv.length > 4) {
      return "Ingresa un CVV válido de 3 o 4 dígitos.";
    }
  }

  return null;
};
