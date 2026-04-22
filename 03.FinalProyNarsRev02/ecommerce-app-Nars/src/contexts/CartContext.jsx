import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { cartApi } from "../api/cartApi";
import { useAuth } from "./AuthContext";
import { useCartStockValidation } from "../hooks/useCartStockValidation";
import { logger } from "../utils/logger";

const CartContext = createContext(null);

const initialState = {
  items: [],
  cartId: null,
  isLoading: true,
  error: null,
};

function mapCartToItems(cart) {
  if (!cart || !Array.isArray(cart.products)) return [];

  return cart.products
    .map((item) => {
      const product = item.product || {};
      const parsedStock = Number(product.stock);
      const image = Array.isArray(product.imagesUrl)
        ? product.imagesUrl[0]
        : product.imagesUrl || product.image || "";

      return {
        id: product._id || product.id || item.product,
        productId: product._id || product.id || item.product,
        name: product.name || "Producto",
        price: Number(product.price || 0),
        image,
        stock:
          product.stock == null || product.stock === ""
            ? null
            : Number.isFinite(parsedStock)
              ? parsedStock
              : null,
        quantity: Number(item.quantity || 0),
      };
    })
    .filter((item) => item.id);
}

function cartReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOAD_SUCCESS":
    case "SET_CART":
      return {
        ...state,
        cartId: action.payload?._id || action.payload?.id || null,
        items: mapCartToItems(action.payload),
        isLoading: false,
        error: null,
      };
    case "LOAD_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "CLEAR_CART_STATE":
      return {
        ...state,
        cartId: null,
        items: [],
        isLoading: false,
        error: null,
      };
    case "RESET_CART_CONTENT":
      return {
        ...state,
        cartId: null,
        items: [],
      };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { showStockError, getSafeRequestedQuantity, getSafeAddQuantity } = useCartStockValidation();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const applyCartResponse = (cart) => {
    dispatch({ type: "SET_CART", payload: cart });
  };

  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      dispatch({ type: "LOAD_START" });

      try {
        if (isAuthenticated) {
          const cart = await cartApi.getCurrent();
          if (!active) return;
          applyCartResponse(cart);
        } else {
          if (!active) return;
          dispatch({ type: "CLEAR_CART_STATE" });
        }
      } catch (loadError) {
        if (!active) return;
        dispatch({
          type: "LOAD_ERROR",
          payload: loadError?.message || "No pudimos cargar el carrito.",
        });
      }
    };

    loadCart();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const persistCartItems = async (nextItems) => {
    if (nextItems.length === 0 && !state.cartId) {
      dispatch({ type: "RESET_CART_CONTENT" });
      return;
    }

    if (!state.cartId && nextItems.length > 0) {
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
    const updated = await cartApi.update(state.cartId, productsPayload);
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
    const existingItem = state.items.find((item) => item.id === productId);
    const addValidation = getSafeAddQuantity(product, existingItem?.quantity || 0, quantity);

    if (!addValidation.ok) {
      showStockError(addValidation.message);
      return;
    }

    dispatch({ type: "LOAD_START" });

    try {
      const cart = await cartApi.addProduct(product.id || product._id, quantity);
      applyCartResponse(cart);
    } catch (requestError) {
      dispatch({
        type: "LOAD_ERROR",
        payload: requestError?.response?.data?.message || requestError.message,
      });
    }
  };

  const removeItem = async (productId) => {
    if (!isAuthenticated) {
      logger.info("cart", "Blocked guest remove from cart", { productId });
      return;
    }

    const nextItems = state.items.filter((item) => item.id !== productId);

    dispatch({ type: "LOAD_START" });

    try {
      await persistCartItems(nextItems);
    } catch (requestError) {
      dispatch({
        type: "LOAD_ERROR",
        payload: requestError?.response?.data?.message || requestError.message,
      });
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      logger.info("cart", "Blocked guest clear cart");
      return;
    }

    dispatch({ type: "LOAD_START" });

    try {
      await persistCartItems([]);
    } catch (requestError) {
      dispatch({
        type: "LOAD_ERROR",
        payload: requestError?.response?.data?.message || requestError.message,
      });
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

    const currentItem = state.items.find((item) => item.id === productId);
    const validation = getSafeRequestedQuantity(currentItem, quantity);

    if (!validation.ok) {
      showStockError(validation.message);
      if (validation.quantity === currentItem?.quantity) {
        return;
      }
      quantity = validation.quantity;
    }

    const nextItems = state.items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    dispatch({ type: "LOAD_START" });

    try {
      await persistCartItems(nextItems);
    } catch (requestError) {
      dispatch({
        type: "LOAD_ERROR",
        payload: requestError?.response?.data?.message || requestError.message,
      });
    }
  };

  const totalItems = useMemo(
    () => state.items.reduce((acc, item) => acc + item.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () => state.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [state.items]
  );

  const value = {
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    addItem,
    removeItem,
    clearCart,
    updateQuantity,
    totalItems,
    totalPrice,
    cartId: state.cartId,
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
