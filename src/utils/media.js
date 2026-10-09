// Strapi media fields are optional: an entry can have no thumbnail or no gallery,
// in which case `data` is null. Always go through these helpers instead of reading
// `field.data.attributes.url` directly.

export const PLACEHOLDER_IMAGE = "/icons/icon-512x512.png";

// URL of a single media field, or of the first file of a multiple one.
export const mediaUrl = (field) => {
  const data = field?.data;
  return (Array.isArray(data) ? data[0] : data)?.attributes?.url;
};

// Image to show for a media field, falling back to the shop logo.
export const imageUrl = (field) => mediaUrl(field) || PLACEHOLDER_IMAGE;

// Image to show for a product: its thumbnail, else its first gallery image,
// else the shop logo.
export const itemImageUrl = (attributes) =>
  mediaUrl(attributes?.item_thumbnail) || mediaUrl(attributes?.item_images) || PLACEHOLDER_IMAGE;
