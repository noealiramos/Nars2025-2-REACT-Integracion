/**
 * Utilidades para validación de formularios
 */

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validateCardNumber = (number) => {
    // Eliminar espacios y guiones
    const cleanNumber = number.replace(/[\s-]/g, "");
    // Formato básico de 16 dígitos
    return /^\d{16}$/.test(cleanNumber);
};

export const validateExpiry = (expiry) => {
    // Formato MM/AA
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

    const [month, year] = expiry.split("/").map(Number);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
};

export const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
};

export const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
        return parts.join(" ");
    } else {
        return v;
    }
};
