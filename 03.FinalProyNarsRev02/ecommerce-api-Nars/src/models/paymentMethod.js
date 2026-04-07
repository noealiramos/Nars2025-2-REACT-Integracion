import mongoose from 'mongoose';
import { isValidExpiryDate, normalizeExpiryDate } from '../utils/paymentExpiry.js';

const PAYMENT_TYPES = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'];

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  type: {
    type: String,
    required: true,
    enum: PAYMENT_TYPES,
  },

  /*** Datos de tarjeta (recomendado NO almacenar el número completo) ***/
  // Si estás en fase demo, mantén estos campos con cuidado (select:false). Ideal: usar tokenización del PSP.
  cardNumber: {
    type: String,
    select: false, // ocúltalo por defecto en consultas
  },
  cardHolderName: {
    type: String,
  },
  expiryDate: {
    type: String, // formato sugerido MM/YY
    set: normalizeExpiryDate,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return isValidExpiryDate(v);
      },
      message: 'expiryDate must be in MM/YY format',
    },
  },
  brand: {
    type: String, // ej. 'VISA', 'MASTERCARD'
  },
  last4: {
    type: String, // últimos 4 dígitos si usas cardNumber temporalmente
    minlength: 4,
    maxlength: 4,
  },
  // token del PSP si más adelante integras Stripe/PayPal vault/etc.
  token: {
    type: String,
    select: false,
  },

  /*** PayPal ***/
  paypalEmail: {
    type: String,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'paypalEmail must be a valid email',
    },
  },

  /*** Transferencia bancaria ***/
  bankName: {
    type: String,
  },
  accountNumber: {
    type: String,
    select: false, // sensible
  },

  /*** Estado ***/
  isDefault: {
    type: Boolean,
    default: false,
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
    index: true,
  },
}, { timestamps: true });

/** Índices útiles **/
paymentMethodSchema.index({ user: 1, createdAt: -1 });
paymentMethodSchema.index({ user: 1, isDefault: 1 });

/**
 * Validaciones condicionales por tipo
 * - credit/debit: requiere al menos last4 y brand (o token si lo usas)
 * - paypal: requiere paypalEmail
 * - bank_transfer: requiere bankName y accountNumber
 */
paymentMethodSchema.pre('validate', function (next) {
  const t = this.type;

  if (t === 'credit_card' || t === 'debit_card') {
    if (!this.last4 && !this.token && !this.cardNumber) {
      return next(new Error('For card types, provide last4 or token (avoid full cardNumber).'));
    }
    if (!this.brand && !this.token) {
      return next(new Error('For card types, brand is required (or use tokenized data).'));
    }
  }

  if (t === 'paypal') {
    if (!this.paypalEmail) {
      return next(new Error('paypalEmail is required for PayPal payment method.'));
    }
  }

  if (t === 'bank_transfer') {
    if (!this.bankName || !this.accountNumber) {
      return next(new Error('bankName and accountNumber are required for bank transfer.'));
    }
  }

  return next();
});

/**
 * Limpieza de campos incongruentes entre tipos:
 * (opcional, ayuda a mantener datos consistentes)
 */
paymentMethodSchema.pre('save', function (next) {
  const t = this.type;

  if (t !== 'credit_card' && t !== 'debit_card') {
    this.cardNumber = undefined;
    this.cardHolderName = undefined;
    this.expiryDate = undefined;
    this.brand = undefined;
    this.last4 = undefined;
    this.token = undefined;
  }

  if (t !== 'paypal') {
    this.paypalEmail = undefined;
  }

  if (t !== 'bank_transfer') {
    this.bankName = undefined;
    this.accountNumber = undefined;
  }

  next();
});


const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
export default PaymentMethod;
