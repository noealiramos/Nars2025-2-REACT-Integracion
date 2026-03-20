import { SHIPPING_COST } from "../../constants/orderConstants";
import "./CartSummary.css";

export function CartSummary({ subtotal, onCheckout }) {
  const iva = subtotal * 0.16;
  const shipping = SHIPPING_COST;
  const total = subtotal + iva + shipping;

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
          <span>IVA (16%)</span>
          <span>{formatMoney(iva)}</span>
        </div>

        <div className="cart-summary__row cart-summary__row--muted">
          <span>Envío</span>
          <span>{formatMoney(shipping)}</span>
        </div>

        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      <button
        type="button"
        className="cart-summary__button"
        onClick={onCheckout}
      >
        Ir a pagar
      </button>

      <p className="cart-summary__note">
        El método de pago se selecciona en el siguiente paso. El envío es fijo
        por ahora ($99 MXN).
      </p>
    </aside>
  );
}
