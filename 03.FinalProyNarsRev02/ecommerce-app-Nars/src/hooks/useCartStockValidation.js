import { useUI } from "../contexts/UIContext";

export function useCartStockValidation() {
  const { dispatch } = useUI();

  const showStockError = (message) => {
    dispatch({ type: "SHOW_MESSAGE", payload: { type: "error", text: message } });
  };

  const getSafeRequestedQuantity = (item, requestedQuantity) => {
    const stock = Number(item?.stock);

    if (!Number.isFinite(requestedQuantity) || requestedQuantity < 0) {
      return { ok: false, message: "La cantidad solicitada no es válida.", quantity: item?.quantity || 1 };
    }

    if (!Number.isFinite(stock) || stock <= 0) {
      return { ok: false, message: "Este producto ya no tiene stock disponible.", quantity: item?.quantity || 1 };
    }

    if (requestedQuantity > stock) {
      return {
        ok: false,
        message: `Solo hay ${stock} unidad(es) disponibles para este producto.`,
        quantity: stock,
      };
    }

    return { ok: true, quantity: requestedQuantity };
  };

  const getSafeAddQuantity = (product, existingQuantity, delta) => {
    const stock = Number(product?.stock);
    const requestedQuantity = Number(existingQuantity || 0) + Number(delta || 0);

    if (!Number.isFinite(stock) || stock <= 0) {
      return { ok: false, message: "Este producto está agotado.", quantity: existingQuantity || 0 };
    }

    if (requestedQuantity > stock) {
      return {
        ok: false,
        message: `Solo hay ${stock} unidad(es) disponibles para este producto.`,
        quantity: stock,
      };
    }

    return { ok: true, quantity: requestedQuantity };
  };

  return {
    showStockError,
    getSafeRequestedQuantity,
    getSafeAddQuantity,
  };
}
