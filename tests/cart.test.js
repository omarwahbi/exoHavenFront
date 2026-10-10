import { expect, test } from "vitest";
import { cartReducer } from "@/app/context/CartContext";

const lamp = { id: 5, documentId: "lamp", name: "Lamp", state: "10500" };
// The same product after a republish in Strapi 5: same documentId, new numeric id.
const lampRepublished = { ...lamp, id: 9 };
const bowl = { id: 6, documentId: "bowl", name: "Bowl", state: "13000" };

test("adding the same product twice increases its quantity", () => {
  let cart = cartReducer([], { type: "ADD_ITEM", item: lamp });
  cart = cartReducer(cart, { type: "ADD_ITEM", item: lampRepublished });
  expect(cart).toHaveLength(1);
  expect(cart[0].quantity).toBe(2);
});

test("decreasing at quantity 1 removes the line", () => {
  let cart = cartReducer([], { type: "ADD_ITEM", item: lamp });
  cart = cartReducer(cart, { type: "ADD_ITEM", item: bowl });
  cart = cartReducer(cart, { type: "DECREASE_ITEM", item: lamp });
  expect(cart.map((line) => line.documentId)).toEqual(["bowl"]);
});

test("remove, clear and load", () => {
  let cart = cartReducer([], { type: "ADD_ITEM", item: lamp });
  cart = cartReducer(cart, { type: "ADD_ITEM", item: bowl });
  expect(cartReducer(cart, { type: "REMOVE_ITEM", item: bowl })).toHaveLength(1);
  expect(cartReducer(cart, { type: "CLEAR_CART" })).toEqual([]);
  expect(cartReducer([], { type: "LOAD", lines: cart })).toBe(cart);
});
