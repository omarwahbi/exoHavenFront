"use client";

import { useCart } from "../context/CartContext";

const AddToCartButton = ({ item }) => {
  const { dispatch } = useCart();
  console.log(item);

  const addToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  return (
    <button
      disabled={item.attributes.out_of_stock}
      onClick={addToCart}
      className={`${
        item.attributes.out_of_stock
          ? "bg-gray-300 px-4  py-2 rounded-md cursor-not-allowed opacity-50"
          : "bg-transparent  hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      }`}
    >
      {item.attributes.out_of_stock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
