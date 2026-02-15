import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import {useAuth} from "./AuthContext";
import *as cartService from "../services/cartService";
import { CART_ACTIONS, cartInitialState, cartReducer } from "./cartReducer";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  const [syncState, setSyncState] = useState({
    syncing: false,
    lastSyncError: null,
  });

  const {isAuth} = useAuth();


  // Funciones auxiliares:
  const getTotalItems = () =>
    state.items.reduce((sum, i) => sum + i.quantity, 0);
  const getTotalPrice = () =>
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Actualizar localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

useEffect(()=>{
  const initializaCart= async ()=> {
    if(isAuth){
      try{
        const backendCart = await cartService.getCart();
        if(backendCart?.items){
          dispatch({type:CART_ACTIONS.INIT,payload: backendCart.items});
        }
      }catch (error){
        console.error(error);
      }
    }
  };
  initializaCart();
},[isAuth]);


const syncToBackend = async (syncFn)=> {
  if(!isAuth) return;

  setSyncState({syncing:true, lastSyncError: null});
  try {
    await syncFn();
    setSyncState({syncing: false, lastSyncError:null});

  } catch (error){
    console.error(error);
    setSyncState({syncing:false, lastSyncError: error});
  }
};







  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE, payload: productId });
  };

  syncToBackend(async ()=>{
    await cartService.removeFromCart(productId);
  });
};


  const updateQuantity = (productId, newQuantity) => {
    dispatch({
      type: CART_ACTIONS.SET_QTY,
      payload: { _id: productId, quantity: newQuantity },
    });

    syncToBackend(async ()=>{
    await cartService.updateCartItem(productId,newQuantity);
  });

  };

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD, payload: { ...product, quantity } });

    syncToBackend(async ()=>{
    await cartService.addToCart(product._id, quantity);
  });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR });

    syncToBackend(async ()=>{
    await cartService.clearCart();
  });
  };

  const value = useMemo(
    () => ({
      cartItems: state.items,
      total: getTotalPrice(),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
    }),
    [state.items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe ser usado dentro de CartProvider");
  return context;
}
