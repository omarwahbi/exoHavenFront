// Strapi media fields are optional: an entry can have no thumbnail or no gallery, in
// which case the field is null (or an empty list). Always go through these helpers
// instead of reading `field.url` directly.

export const PLACEHOLDER_IMAGE = "/icons/icon-512x512.png";

// URL of a single media field, or of the first file of a multiple one.
export const mediaUrl = (field) => (Array.isArray(field) ? field[0] : field)?.url;

// Image to show for a media field, falling back to the shop logo.
export const imageUrl = (field) => mediaUrl(field) || PLACEHOLDER_IMAGE;

// Image to show for a product: its thumbnail, else its first gallery image,
// else the shop logo.
export const itemImageUrl = (item) =>
  mediaUrl(item?.item_thumbnail) || mediaUrl(item?.item_images) || PLACEHOLDER_IMAGE;
