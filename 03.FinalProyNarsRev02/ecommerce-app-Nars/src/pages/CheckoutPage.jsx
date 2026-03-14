import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../components/atoms/TextInput";
import { Heading } from "../components/atoms/Heading";
import { Button } from "../components/atoms/Button";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { shippingApi } from "../api/shippingApi";
import { paymentApi } from "../api/paymentApi";
import { orderApi } from "../api/orderApi";
import { SHIPPING_COST } from "../constants/orderConstants";
import "./CheckoutPage.css";

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔹 Datos de Envío
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // 🔹 Datos de pago
  const [cardAlias, setCardAlias] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(user?.name || "");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!items.length) {
      navigate("/");
    }
  }, [items, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validaciones básicas
    if (!name || !address || !city || !state || !postalCode || !phone || 
        !cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
      setErrorMsg("Por favor, completa todos los campos requeridos.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Crear Dirección de Envío
      const shippingRes = await shippingApi.create({
        name,
        address,
        city,
        state,
        postalCode,
        phone,
        isDefault: saveAsDefault
      });
      const shippingAddressId = shippingRes._id;

      // 2. Crear Método de Pago
      const last4 = cardNumber.slice(-4);
      const paymentRes = await paymentApi.create({
        type: "credit_card",
        cardNumber, // El backend debería manejar select:false
        cardHolderName: cardHolder,
        expiryDate: cardExpiry,
        brand: "Visa", // Hardcoded o detección simple
        last4,
        isDefault: saveAsDefault
      });
      const paymentMethodId = paymentRes._id;

      // 3. Crear Orden
      const orderData = {
        products: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: shippingAddressId,
        paymentMethod: paymentMethodId,
        shippingCost: SHIPPING_COST
      };

      const finalOrder = await orderApi.create(orderData);

      // Limpiar carrito y navegar
      clearCart();
      navigate("/confirmation", { state: { order: finalOrder } });

    } catch (error) {
      console.error("Order completion failed:", error);
      setErrorMsg(error.response?.data?.error || "Hubo un error al procesar tu compra. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page container checkout-page">
      <Heading level={2}>Checkout</Heading>
      <p className="checkout-page__intro">
        Ingresa tus datos de envío y pago para completar la orden.
      </p>

      <form onSubmit={handleSubmit} className="checkout-form">
        <section className="checkout-section">
          <Heading level={3}>Información de Envío</Heading>
          <div className="form-grid">
            <TextInput
              id="name"
              label="Nombre del destinatario"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              required
            />
            <TextInput
              id="phone"
              label="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-15 dígitos"
              required
            />
            <TextInput
              id="address"
              label="Calle y número"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej. Av. Reforma 123"
              required
            />
            <div className="form-row">
              <TextInput
                id="city"
                label="Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ciudad"
                required
              />
              <TextInput
                id="state"
                label="Estado"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Estado"
                required
              />
              <TextInput
                id="postalCode"
                label="Código Postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="5-6 dígitos"
                required
              />
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        <section className="checkout-section">
          <Heading level={3}>Método de Pago</Heading>
          <div className="payment-form">
            <TextInput
              id="cardHolder"
              label="Nombre en la tarjeta"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="Tal cual aparece"
              required
            />
            <TextInput
              id="cardNumber"
              label="Número de tarjeta"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              required
            />
            <div className="payment-form__inline">
              <TextInput
                id="cardExpiry"
                label="Vencimiento"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                required
              />
              <TextInput
                id="cardCvv"
                label="CVV"
                type="password"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                placeholder="***"
                required
              />
            </div>
          </div>
        </section>

        {errorMsg && <p className="form-error">{errorMsg}</p>}

        <div className="checkout-form__actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Procesando..." : "Confirmar Compra"}
          </Button>
        </div>
      </form>
    </main>
  );
}

