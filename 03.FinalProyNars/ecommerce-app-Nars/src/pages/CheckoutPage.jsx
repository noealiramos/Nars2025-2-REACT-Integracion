import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../components/atoms/TextInput";
import { Heading } from "../components/atoms/Heading";
import { Button } from "../components/atoms/Button";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { appendOrderToHistory, STORAGE_KEYS } from "../utils/storageHelpers";
import { SHIPPING_COST } from "../constants/orderConstants";
import {
  validateEmail,
  validateCardNumber,
  validateExpiry,
  validateCVV,
  formatCardNumber
} from "../utils/validationHelpers";
import "./CheckoutPage.css";

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");

  const [cardAlias, setCardAlias] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!items.length) {
      navigate("/");
    }
  }, [items, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!validateEmail(email)) newErrors.email = "Email inválido";
    if (!address.trim()) newErrors.address = "La dirección es obligatoria";
    if (!cardAlias.trim()) newErrors.cardAlias = "El alias de la tarjeta es obligatorio";
    if (!validateCardNumber(cardNumber)) newErrors.cardNumber = "Número de tarjeta inválido (16 dígitos)";
    if (!cardHolder.trim()) newErrors.cardHolder = "El nombre del titular es obligatorio";
    if (!validateExpiry(cardExpiry)) newErrors.cardExpiry = "Fecha inválida (MM/AA)";
    if (!validateCVV(cardCvv)) newErrors.cardCvv = "CVV inválido (3-4 dígitos)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!items.length) return;

    setSubmitting(true);

    const iva = totalPrice * 0.16;
    const shippingCost = SHIPPING_COST;
    const total = totalPrice + iva + shippingCost;

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    const last4 = cleanCardNumber.slice(-4);
    const paymentMethodSummary = `Tarjeta ${cardAlias ? cardAlias + " " : ""
      }terminación ${last4 || "****"}`;

    const order = {
      id: `ORD-${Date.now()}`,
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
      items,
      subtotal: totalPrice,
      iva,
      shippingCost,
      total,
      shippingAddress: address,
      paymentMethod: "card",
      paymentDetails: {
        cardAlias,
        cardHolder,
        cardLast4: last4,
        cardExpiry,
        saveAsDefault,
      },
      paymentMethodSummary,
      createdAt: new Date().toISOString(),
    };

    appendOrderToHistory(order);
    localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(order));
    clearCart();

    setSubmitting(false);
    navigate("/confirmation");
  };

  return (
    <main className="page container checkout-page">
      <Heading level={2}>Checkout</Heading>
      <p className="checkout-page__intro">
        Ingresa tus datos básicos para finalizar tu compra. Este flujo es simulado y no
        realiza cobros reales.
      </p>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <Heading level={3}>Información de Envío</Heading>
          <TextInput
            id="name"
            label="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            error={errors.name}
            required
          />
          <TextInput
            id="email"
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            error={errors.email}
            required
          />
          <TextInput
            id="address"
            label="Dirección de envío"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle, número, colonia, ciudad, estado"
            error={errors.address}
            required
          />
        </div>

        <hr className="section-divider" />

        <section className="checkout-payment card-section">
          <Heading level={3}>Método de Pago (Simulado)</Heading>
          <p className="checkout-payment__hint">
            No se realizan cargos reales. Puedes ingresar datos de ejemplo.
          </p>

          <div className="payment-form">
            <TextInput
              id="cardAlias"
              label="Alias de la tarjeta"
              value={cardAlias}
              onChange={(e) => setCardAlias(e.target.value)}
              placeholder="Ej. Bancomer, Nómina, Crédito oro"
              error={errors.cardAlias}
              required
            />

            <TextInput
              id="cardNumber"
              label="Número de tarjeta"
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4444 4444 4444 5555"
              error={errors.cardNumber}
              required
            />

            <TextInput
              id="cardHolder"
              label="Nombre del titular"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="Nombre tal como aparece en la tarjeta"
              error={errors.cardHolder}
              required
            />

            <div className="payment-form__inline">
              <TextInput
                id="cardExpiry"
                label="Fecha de expiración"
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/AA"
                error={errors.cardExpiry}
                required
              />
              <TextInput
                id="cardCvv"
                label="CVV"
                type="password"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                placeholder="***"
                error={errors.cardCvv}
                required
              />
            </div>

            <label className="payment-form__checkbox">
              <input
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
              />
              <span>Establecer como método de pago predeterminado (simulado)</span>
            </label>
          </div>
        </section>

        <hr className="section-divider" />

        <div className="checkout-form__actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Procesando compra..." : "Confirmar compra"}
          </Button>
        </div>
      </form>
    </main>
  );
}
