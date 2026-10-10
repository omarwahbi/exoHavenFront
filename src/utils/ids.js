// Strapi 5 gives every entry a permanent documentId, while its numeric id changes each
// time it is republished. Links, URLs and filters use the documentId. Numeric ids
// still arrive from old links and bookmarks; the backend maps those to the right
// entry (legacy_id), and the pages redirect them to the documentId URL.

// The id to put in links and URLs for an entry ({ id, documentId, attributes }).
export const entryKey = (entry) => entry?.documentId ?? entry?.id;

// True for an old numeric id from a link made before the move to documentIds.
export const isLegacyId = (value) => /^\d+$/.test(String(value ?? ""));
