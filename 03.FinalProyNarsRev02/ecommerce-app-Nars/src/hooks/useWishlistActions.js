import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProductToWishlist,
  clearWishlist,
  moveWishlistProductToCart,
  removeProductFromWishlist,
} from "../services/wishlistService";
import { useUI } from "../contexts/UIContext";

export function useWishlistActions() {
  const queryClient = useQueryClient();
  const { dispatch } = useUI();

  const invalidateWishlist = () => queryClient.invalidateQueries({ queryKey: ["wishlist"] });

  const addMutation = useMutation({
    mutationFn: addProductToWishlist,
    onSuccess: async () => {
      dispatch({ type: "SHOW_MESSAGE", payload: { type: "success", text: "Producto agregado a wishlist." } });
      await invalidateWishlist();
    },
    onError: (error) => {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: { type: "error", text: error.response?.data?.message || "No pudimos agregar el producto a wishlist." },
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeProductFromWishlist,
    onSuccess: async () => {
      dispatch({ type: "SHOW_MESSAGE", payload: { type: "success", text: "Producto eliminado de wishlist." } });
      await invalidateWishlist();
    },
    onError: (error) => {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: { type: "error", text: error.response?.data?.message || "No pudimos actualizar la wishlist." },
      });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearWishlist,
    onSuccess: async () => {
      dispatch({ type: "SHOW_MESSAGE", payload: { type: "success", text: "Wishlist limpiada correctamente." } });
      await invalidateWishlist();
    },
    onError: (error) => {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: { type: "error", text: error.response?.data?.message || "No pudimos limpiar la wishlist." },
      });
    },
  });

  const moveMutation = useMutation({
    mutationFn: moveWishlistProductToCart,
    onSuccess: async () => {
      dispatch({ type: "SHOW_MESSAGE", payload: { type: "success", text: "Producto movido a carrito." } });
      await invalidateWishlist();
    },
    onError: (error) => {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: { type: "error", text: error.response?.data?.message || "No pudimos mover el producto al carrito." },
      });
    },
  });

  return {
    addToWishlist: addMutation.mutateAsync,
    removeFromWishlist: removeMutation.mutateAsync,
    clearUserWishlist: clearMutation.mutateAsync,
    moveToCartFromWishlist: moveMutation.mutateAsync,
    isMutating:
      addMutation.isPending ||
      removeMutation.isPending ||
      clearMutation.isPending ||
      moveMutation.isPending,
  };
}
