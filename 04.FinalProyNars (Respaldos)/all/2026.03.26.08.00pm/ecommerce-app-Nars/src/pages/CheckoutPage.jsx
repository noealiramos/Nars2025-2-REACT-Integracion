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
import { appendOrderToHistory } from "../utils/storageHelpers";
import { logger } from "../utils/logger";
import { fetchShippingAddressesByUser } from "../services/shippingService";
import { fetchPaymentMethodsByUser } from "../services/paymentService";
import "./CheckoutPage.css";

const getCheckoutErrorMessage = (error) => {
  const responseData = error.response?.data;

  if (responseData?.error) return responseData.error;
  if (responseData?.message) return responseData.message;
  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors[0]?.msg || responseData.errors[0]?.message || "Hubo un error al validar tus datos.";
  }

  return "Hubo un error al procesar tu compra. Por favor intenta de nuevo.";
};

const getCheckoutCacheKey = (entity, userId) => `checkout-${entity}-${userId}`;

const readCachedCheckoutItems = (entity, userId) => {
  if (!userId) return [];

  try {
    const rawValue = localStorage.getItem(getCheckoutCacheKey(entity, userId));
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

const writeCachedCheckoutItems = (entity, userId, items) => {
  if (!userId) return;

  localStorage.setItem(getCheckoutCacheKey(entity, userId), JSON.stringify(items));
};

export function CheckoutPage() {
  const { items, totalPrice, clearCart, isLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [loadingSavedData, setLoadingSavedData] = useState(false);
  const [shippingMode, setShippingMode] = useState("new");
  const [paymentMode, setPaymentMode] = useState("new");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState("");

  // 🔹 Datos de Envío
  const [name, setName] = useState(user?.displayName || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // 🔹 Datos de pago
  const [cardAlias, setCardAlias] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(user?.displayName || "");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const applySavedAddress = (addressData) => {
    if (!addressData) return;
    setName(addressData.name || user?.displayName || "");
    setAddress(addressData.address || "");
    setCity(addressData.city || "");
    setState(addressData.state || "");
    setPostalCode(addressData.postalCode || "");
    setPhone(addressData.phone || "");
  };

  const applySavedPaymentMethod = (paymentMethod) => {
    if (!paymentMethod) return;
    setCardHolder(paymentMethod.cardHolderName || user?.displayName || "");
    setCardExpiry(paymentMethod.expiryDate || "");
    setCardNumber(paymentMethod.last4 ? `•••• ${paymentMethod.last4}` : "");
    setCardCvv("");
  };

  useEffect(() => {
    if (!isLoading && !items.length) {
      navigate("/");
    }
  }, [items, isLoading, navigate]);

  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;

    const loadSavedCheckoutData = async () => {
      setLoadingSavedData(true);

      try {
        const cachedAddresses = readCachedCheckoutItems("addresses", user.id);
        const cachedPaymentMethods = readCachedCheckoutItems("payment-methods", user.id);

        if (cachedAddresses.length > 0) {
          setSavedAddresses(cachedAddresses);
          const cachedDefaultAddress = cachedAddresses.find((entry) => entry.isDefault) || cachedAddresses[0];
          setShippingMode("existing");
          setSelectedAddressId(cachedDefaultAddress._id);
          applySavedAddress(cachedDefaultAddress);
        }

        if (cachedPaymentMethods.length > 0) {
          setSavedPaymentMethods(cachedPaymentMethods);
          const cachedDefaultPaymentMethod = cachedPaymentMethods.find((entry) => entry.isDefault) || cachedPaymentMethods[0];
          setPaymentMode("existing");
          setSelectedPaymentMethodId(cachedDefaultPaymentMethod._id);
          applySavedPaymentMethod(cachedDefaultPaymentMethod);
        }

        const [addresses, paymentMethods] = await Promise.all([
          fetchShippingAddressesByUser(user.id),
          fetchPaymentMethodsByUser(user.id),
        ]);

        if (!mounted) return;

        setSavedAddresses(addresses);
        setSavedPaymentMethods(paymentMethods);
        writeCachedCheckoutItems("addresses", user.id, addresses);
        writeCachedCheckoutItems("payment-methods", user.id, paymentMethods);

        const defaultAddress = addresses.find((entry) => entry.isDefault) || addresses[0];
        const defaultPaymentMethod = paymentMethods.find((entry) => entry.isDefault) || paymentMethods[0];

        if (defaultAddress) {
          setShippingMode("existing");
          setSelectedAddressId(defaultAddress._id);
          applySavedAddress(defaultAddress);
        }

        if (defaultPaymentMethod) {
          setPaymentMode("existing");
          setSelectedPaymentMethodId(defaultPaymentMethod._id);
          applySavedPaymentMethod(defaultPaymentMethod);
        }
      } catch (error) {
        logger.error("checkout", "Failed to load saved checkout data", error);
      } finally {
        if (mounted) {
          setLoadingSavedData(false);
        }
      }
    };

    loadSavedCheckoutData();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const requiresNewShipping = shippingMode === "new" || !selectedAddressId;
  const requiresNewPayment = paymentMode === "new" || !selectedPaymentMethodId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validaciones básicas
    if (
      (requiresNewShipping && (!name || !address || !city || !state || !postalCode || !phone)) ||
      (requiresNewPayment && (!cardNumber || !cardHolder || !cardExpiry || !cardCvv))
    ) {
      setErrorMsg("Por favor, completa todos los campos requeridos.");
      return;
    }

    setSubmitting(true);

    try {
      let shippingAddressId = selectedAddressId;
      let paymentMethodId = selectedPaymentMethodId;

      if (requiresNewShipping) {
        const shippingRes = await shippingApi.create({
          name,
          address,
          city,
          state,
          postalCode,
          phone,
          isDefault: saveAsDefault || savedAddresses.length === 0,
        });
        shippingAddressId = shippingRes._id;
        const nextAddresses = [shippingRes, ...savedAddresses.filter((entry) => entry._id !== shippingRes._id)].sort((left, right) => Number(Boolean(right.isDefault)) - Number(Boolean(left.isDefault)));
        setSavedAddresses(nextAddresses);
        writeCachedCheckoutItems("addresses", user?.id, nextAddresses);
      }

      if (requiresNewPayment) {
        const last4 = cardNumber.replace(/\s+/g, "").slice(-4);
        const paymentRes = await paymentApi.create({
          type: "credit_card",
          cardHolderName: cardHolder,
          expiryDate: cardExpiry,
          brand: "Visa",
          last4,
          isDefault: saveAsDefault || savedPaymentMethods.length === 0,
        });
        paymentMethodId = paymentRes._id;
        const nextPaymentMethods = [paymentRes, ...savedPaymentMethods.filter((entry) => entry._id !== paymentRes._id)].sort((left, right) => Number(Boolean(right.isDefault)) - Number(Boolean(left.isDefault)));
        setSavedPaymentMethods(nextPaymentMethods);
        writeCachedCheckoutItems("payment-methods", user?.id, nextPaymentMethods);
      }

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
      appendOrderToHistory(finalOrder);
      clearCart();
        navigate("/confirmation", { state: { order: finalOrder } });

    } catch (error) {
      logger.error("checkout", "Order completion failed", {
        status: error.response?.status,
        data: error.response?.data,
      });
      setErrorMsg(getCheckoutErrorMessage(error));
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
          {savedAddresses.length > 0 && (
            <div className="saved-options" data-testid="saved-shipping-options">
              <p className="saved-options__label">Elige una dirección guardada o captura una nueva.</p>
              <label className="saved-option-card saved-option-card--new" htmlFor="shipping-mode-new">
                <input
                  id="shipping-mode-new"
                  type="radio"
                  name="shippingMode"
                  value="new"
                  checked={shippingMode === "new"}
                  onChange={() => setShippingMode("new")}
                  data-testid="shipping-option-new"
                />
                <span>Usar una dirección nueva</span>
              </label>
              {savedAddresses.map((savedAddress) => (
                <label className="saved-option-card" key={savedAddress._id} htmlFor={`shipping-option-${savedAddress._id}`}>
                  <input
                    id={`shipping-option-${savedAddress._id}`}
                    type="radio"
                    name="shippingMode"
                    value={savedAddress._id}
                    checked={shippingMode === "existing" && selectedAddressId === savedAddress._id}
                    onChange={() => {
                      setShippingMode("existing");
                      setSelectedAddressId(savedAddress._id);
                      applySavedAddress(savedAddress);
                    }}
                    data-testid={`shipping-option-${savedAddress._id}`}
                  />
                  <span>
                    <strong>{savedAddress.name}</strong>
                    <small>{`${savedAddress.address}, ${savedAddress.city}, ${savedAddress.state}`}</small>
                  </span>
                </label>
              ))}
            </div>
          )}
          <div className="form-grid">
            <TextInput
              id="name"
              label="Nombre del destinatario"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              required={requiresNewShipping}
              disabled={shippingMode === "existing"}
            />
            <TextInput
              id="phone"
              label="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-15 dígitos"
              required={requiresNewShipping}
              disabled={shippingMode === "existing"}
            />
            <TextInput
              id="address"
              label="Calle y número"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej. Av. Reforma 123"
              required={requiresNewShipping}
              disabled={shippingMode === "existing"}
            />
            <div className="form-row">
              <TextInput
                id="city"
                label="Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ciudad"
                required={requiresNewShipping}
                disabled={shippingMode === "existing"}
              />
              <TextInput
                id="state"
                label="Estado"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Estado"
                required={requiresNewShipping}
                disabled={shippingMode === "existing"}
              />
              <TextInput
                id="postalCode"
                label="Código Postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="5-6 dígitos"
                required={requiresNewShipping}
                disabled={shippingMode === "existing"}
              />
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        <section className="checkout-section">
          <Heading level={3}>Método de Pago</Heading>
          {savedPaymentMethods.length > 0 && (
            <div className="saved-options" data-testid="saved-payment-options">
              <p className="saved-options__label">Selecciona un método guardado o agrega uno nuevo.</p>
              <label className="saved-option-card saved-option-card--new" htmlFor="payment-mode-new">
                <input
                  id="payment-mode-new"
                  type="radio"
                  name="paymentMode"
                  value="new"
                  checked={paymentMode === "new"}
                  onChange={() => setPaymentMode("new")}
                  data-testid="payment-option-new"
                />
                <span>Usar un método nuevo</span>
              </label>
              {savedPaymentMethods.map((paymentMethod) => (
                <label className="saved-option-card" key={paymentMethod._id} htmlFor={`payment-option-${paymentMethod._id}`}>
                  <input
                    id={`payment-option-${paymentMethod._id}`}
                    type="radio"
                    name="paymentMode"
                    value={paymentMethod._id}
                    checked={paymentMode === "existing" && selectedPaymentMethodId === paymentMethod._id}
                    onChange={() => {
                      setPaymentMode("existing");
                      setSelectedPaymentMethodId(paymentMethod._id);
                      applySavedPaymentMethod(paymentMethod);
                    }}
                    data-testid={`payment-option-${paymentMethod._id}`}
                  />
                  <span>
                    <strong>{paymentMethod.brand || "Tarjeta"} terminada en {paymentMethod.last4}</strong>
                    <small>{paymentMethod.cardHolderName || user?.displayName}</small>
                  </span>
                </label>
              ))}
            </div>
          )}
          <div className="payment-form">
            <TextInput
              id="cardHolder"
              label="Nombre en la tarjeta"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="Tal cual aparece"
              required={requiresNewPayment}
              disabled={paymentMode === "existing"}
            />
            <TextInput
              id="cardNumber"
              label="Número de tarjeta"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              required={requiresNewPayment}
              disabled={paymentMode === "existing"}
            />
            <div className="payment-form__inline">
              <TextInput
                id="cardExpiry"
                label="Vencimiento"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                required={requiresNewPayment}
                disabled={paymentMode === "existing"}
              />
              <TextInput
                id="cardCvv"
                label="CVV"
                type="password"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                placeholder="***"
                required={requiresNewPayment}
                disabled={paymentMode === "existing"}
              />
            </div>
            {(shippingMode === "new" || paymentMode === "new") && (
              <label className="payment-form__checkbox" htmlFor="saveAsDefault">
                <input
                  id="saveAsDefault"
                  type="checkbox"
                  checked={saveAsDefault}
                  onChange={(e) => setSaveAsDefault(e.target.checked)}
                  data-testid="input-save-default"
                />
                Guardar los nuevos datos como predeterminados para futuras compras
              </label>
            )}
          </div>
        </section>

        {loadingSavedData && <p className="checkout-page__hint">Cargando datos guardados...</p>}
        {errorMsg && <p className="form-error">{errorMsg}</p>}

        <div className="checkout-form__actions">
          <Button type="submit" disabled={submitting} data-testid="btn-confirmar-compra">
            {submitting ? "Procesando..." : "Confirmar Compra"}
          </Button>
        </div>
      </form>
    </main>
  );
}
