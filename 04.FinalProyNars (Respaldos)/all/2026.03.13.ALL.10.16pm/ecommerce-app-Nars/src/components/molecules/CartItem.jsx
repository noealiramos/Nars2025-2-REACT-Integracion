import { Button } from "../atoms/Button";
import "./CartItem.css";

export function CartItem({ item, onRemove, onChangeQuantity }) {
  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(item.price);

  const subtotal = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(item.price * item.quantity);

  return (
    <div className="cart-item">
      <div className="cart-item__thumb">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="cart-item__image"
            loading="lazy"
          />
        ) : (
          <span className="cart-item__image-placeholder">Sin imagen</span>
        )}
      </div>
      <div className="cart-item__content">
        <div className="cart-item__header">
          <div>
            <h3 className="cart-item__name">{item.name}</h3>
            <p className="cart-item__unit-price">{formattedPrice} c/u</p>
          </div>
          <Button variant="ghost" type="button" onClick={() => onRemove(item.id)}>
            Quitar
          </Button>
        </div>
        <div className="cart-item__footer">
          <div className="cart-item__quantity">
            <span>Cantidad:</span>
            <button
              type="button"
              className="cart-item__qty-btn"
              onClick={() => onChangeQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span className="cart-item__qty-value">{item.quantity}</span>
            <button
              type="button"
              className="cart-item__qty-btn"
              onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <p className="cart-item__subtotal">Subtotal: {subtotal}</p>
        </div>
      </div>
    </div>
  );
}