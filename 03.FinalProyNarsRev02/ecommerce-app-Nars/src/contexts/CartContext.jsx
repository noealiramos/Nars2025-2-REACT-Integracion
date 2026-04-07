import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartApi } from "../api/cartApi";
import { useAuth } from "./AuthContext";
import { useCartStockValidation } from "../hooks/useCartStockValidation";
import { logger } from "../utils/logger";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { showStockError, getSafeRequestedQuantity, getSafeAddQuantity } = useCartStockValidation();
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapCartToItems = (cart) => {
    if (!cart || !Array.isArray(cart.products)) return [];

    return cart.products
      .map((item) => {
        const product = item.product || {};
        const image = Array.isArray(product.imagesUrl)
          ? product.imagesUrl[0]
          : product.imagesUrl || product.image || "";

        return {
          id: product._id || product.id || item.product,
          productId: product._id || product.id || item.product,
          name: product.name || "Producto",
          price: Number(product.price || 0),
          image,
          stock: Number(product.stock || 0),
          quantity: Number(item.quantity || 0),
        };
      })
      .filter((item) => item.id);
  };

  const applyCartResponse = (cart) => {
    setCartId(cart?._id || cart?.id || null);
    setItems(mapCartToItems(cart));
  };

  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isAuthenticated) {
          const cart = await cartApi.getCurrent();
          if (!active) return;
          applyCartResponse(cart);
        } else {
          if (!active) return;
          setCartId(null);
          setItems([]);
        }
      } catch (loadError) {
        if (!active) return;
        setError(loadError?.message || "No pudimos cargar el carrito.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadCart();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const persistCartItems = async (nextItems) => {
    if (nextItems.length === 0 && !cartId) {
      setItems([]);
      return;
    }

    if (!cartId && nextItems.length > 0) {
      const first = nextItems[0];
      const created = await cartApi.addProduct(first.id, first.quantity || 1);
      const createdId = created?._id || created?.id;

      if (nextItems.length === 1 || !createdId) {
        applyCartResponse(created);
        return;
      }

      const productsPayload = nextItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));
      const updated = await cartApi.update(createdId, productsPayload);
      applyCartResponse(updated);
      return;
    }

    const productsPayload = nextItems.map((item) => ({
      product: item.id,
      quantity: item.quantity,
    }));
    const updated = await cartApi.update(cartId, productsPayload);
    applyCartResponse(updated);
  };

  const addItem = async (product, quantity = 1) => {
    if (!product?.id && !product?._id) return;

    if (!isAuthenticated) {
      logger.info("cart", "Blocked guest add to cart", {
        productId: product.id || product._id,
      });
      return;
    }

    const productId = product.id || product._id;
    const existingItem = items.find((item) => item.id === productId);
    const addValidation = getSafeAddQuantity(product, existingItem?.quantity || 0, quantity);

    if (!addValidation.ok) {
      showStockError(addValidation.message);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cart = await cartApi.addProduct(product.id || product._id, quantity);
      applyCartResponse(cart);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId) => {
    if (!isAuthenticated) {
      logger.info("cart", "Blocked guest remove from cart", { productId });
      return;
    }

    const nextItems = items.filter((item) => item.id !== productId);

    setIsLoading(true);
    setError(null);

    try {
      await persistCartItems(nextItems);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      logger.info("cart", "Blocked guest clear cart");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await persistCartItems([]);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      logger.info("cart", "Blocked guest quantity update", { productId, quantity });
      return;
    }

    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

     const currentItem = items.find((item) => item.id === productId);
     const validation = getSafeRequestedQuantity(currentItem, quantity);

     if (!validation.ok) {
       showStockError(validation.message);
       if (validation.quantity === currentItem?.quantity) {
         return;
       }
       quantity = validation.quantity;
     }

    const nextItems = items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

     setIsLoading(true);
     setError(null);

    try {
      await persistCartItems(nextItems);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const value = {
    items,
    isLoading,
    error,
    addItem,
    removeItem,
    clearCart,
    updateQuantity,
    totalItems,
    totalPrice,
    isGuestMode: !isAuthenticated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
