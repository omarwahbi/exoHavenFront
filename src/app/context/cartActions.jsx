import { useCart } from "../context/CartContext";

const useCartActions = () => {
  const { dispatch } = useCart();

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const decreaseQuantity = (id) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: { id } });
  };

  const increaseQuantity = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return {
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
  };
};

export default useCartActions;
