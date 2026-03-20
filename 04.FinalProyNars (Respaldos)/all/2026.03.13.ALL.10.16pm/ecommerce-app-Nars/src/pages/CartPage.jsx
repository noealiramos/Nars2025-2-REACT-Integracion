import { Link, useNavigate } from "react-router-dom";
import { CartItem } from "../components/molecules/CartItem";
import { CartSummary } from "../components/organisms/CartSummary";
import { useCart } from "../contexts/CartContext";
import { Heading } from "../components/atoms/Heading";
import { Button } from "../components/atoms/Button";
import "./CartPage.css";

export function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const isEmpty = items.length === 0;

  return (
    <main className="page container cart-page">
      <Heading level={2}>Tu carrito</Heading>
      <div className="cart-page__layout">
        <section>
          {isEmpty ? (
            <div className="cart-empty">
              <p className="cart-empty__title">Tu carrito está vacío</p>
              <p className="cart-empty__text">
                Cuando agregues piezas de Ramdi Jewerly, aparecerán aquí.
              </p>
              <Link to="/" className="cart-empty__button">
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <div className="cart-items">
              <div className="cart-items__header">
                <p className="cart-items__info">
                  Tienes {items.length} producto(s) en tu carrito.
                </p>
                <Button type="button" variant="ghost" onClick={clearCart}>
                  Vaciar carrito
                </Button>
              </div>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onChangeQuantity={updateQuantity}
                />
              ))}
            </div>
          )}
        </section>

        <section className="cart-page__summary">
          {!isEmpty && (
            <CartSummary subtotal={totalPrice} onCheckout={handleCheckout} />
          )}
          {isEmpty && (
            <p className="cart-page__hint">
              Agrega al menos una pieza para poder continuar al pago.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}