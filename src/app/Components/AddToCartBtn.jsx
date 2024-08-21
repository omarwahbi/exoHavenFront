"use client";

import { useCart } from "../context/CartContext";

const AddToCartButton = ({ item }) => {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  return (
    <button
      onClick={addToCart}
      className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
