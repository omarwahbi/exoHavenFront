import { describe, expect, test } from "vitest";
import { flattenEntry, flattenResponse } from "@/utils/strapi";

// A Strapi 4 (v4 response format) item with a relation, a single media field and a
// multiple one.
const v4Item = {
  id: 2,
  documentId: "doc2",
  attributes: {
    name: "Lamp",
    state: "10500",
    category: { data: { id: 1, attributes: { name: "Reptiles" } } },
    sub_category: { data: null },
    item_thumbnail: { data: { id: 11, attributes: { url: "https://ik.imagekit.io/x/a.png" } } },
    item_images: { data: [{ id: 12, attributes: { url: "https://ik.imagekit.io/x/b.png" } }] },
  },
};

describe("flattenEntry", () => {
  test("turns a v4 entry into the flat Strapi 5 shape", () => {
    expect(flattenEntry(v4Item)).toEqual({
      id: 2,
      documentId: "doc2",
      name: "Lamp",
      state: "10500",
      category: { id: 1, name: "Reptiles" },
      sub_category: null,
      item_thumbnail: { id: 11, url: "https://ik.imagekit.io/x/a.png" },
      item_images: [{ id: 12, url: "https://ik.imagekit.io/x/b.png" }],
    });
  });

  test("leaves flat (Strapi 5) data unchanged", () => {
    const flat = flattenEntry(v4Item);
    expect(flattenEntry(flat)).toEqual(flat);
  });

  test("handles lists and empty values", () => {
    expect(flattenEntry([v4Item])[0].name).toBe("Lamp");
    expect(flattenEntry(null)).toBeNull();
    expect(flattenEntry(undefined)).toBeUndefined();
  });

  test("keeps fields next to attributes, such as a cart line's quantity", () => {
    expect(flattenEntry({ ...v4Item, quantity: 3 }).quantity).toBe(3);
  });
});

test("flattenResponse flattens data and keeps meta", () => {
  const body = { data: [v4Item], meta: { pagination: { page: 1, pageCount: 2 } } };
  const flat = flattenResponse(body);
  expect(flat.data[0].category.name).toBe("Reptiles");
  expect(flat.meta).toEqual(body.meta);
});
