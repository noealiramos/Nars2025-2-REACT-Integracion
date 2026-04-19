import { SHIPPING_COST } from "../../constants/orderConstants";
import "./CartSummary.css";

export function CartSummary({ subtotal, shippingCost = SHIPPING_COST, total, onCheckout }) {
  const resolvedShippingCost = Number(shippingCost || 0);
  const resolvedTotal = Number.isFinite(Number(total))
    ? Number(total)
    : subtotal + resolvedShippingCost;

  const formatMoney = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  return (
    <aside className="cart-summary">
      <h2 className="cart-summary__title">Resumen de compra</h2>

      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>

        <div className="cart-summary__row cart-summary__row--muted">
          <span>Envío</span>
          <span>{formatMoney(resolvedShippingCost)}</span>
        </div>

        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span>{formatMoney(resolvedTotal)}</span>
        </div>
      </div>

      <button
        type="button"
        className="cart-summary__button"
        onClick={onCheckout}
        data-testid="checkout-btn"
      >
        Ir a pagar
      </button>

      <p className="cart-summary__note">
        El metodo de pago se selecciona en el siguiente paso. Los cargos
        finales se confirman desde backend al crear la orden.
      </p>
    </aside>
  );
}
