// Strapi 4 wrapped every entry as { id, attributes: { ... } } and every relation or
// media field as { data: ... }. Strapi 5 returns them flat: { id, documentId, name,
// category: { ... }, item_images: [ ... ] }. The app only uses the flat shape, and
// flattenEntry converts the old one, so it works whichever format the API sends (and
// with carts saved in browsers before the switch). Flat data passes through unchanged.

const isRelationWrapper = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).length === 1 &&
  "data" in value;

export const flattenEntry = (entry) => {
  if (Array.isArray(entry)) return entry.map(flattenEntry);
  if (entry === null || typeof entry !== "object" || !entry.attributes) return entry;

  const { attributes, ...rest } = entry;
  const flat = { ...rest };
  for (const [key, value] of Object.entries(attributes)) {
    flat[key] = isRelationWrapper(value) ? flattenEntry(value.data) : value;
  }
  return flat;
};

// For a whole API response body ({ data, meta }).
export const flattenResponse = (body) =>
  body && typeof body === "object" && "data" in body ? { ...body, data: flattenEntry(body.data) } : body;
