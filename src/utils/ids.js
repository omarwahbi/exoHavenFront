// Strapi 5 gives every entry a permanent documentId, while its numeric id changes each
// time it is republished. Links, URLs and filters use the documentId. Numeric ids
// still arrive from old links and bookmarks: src/middleware.js redirects those to the
// documentId URL (the backend maps them to the right entry through legacy_id).

// The id to put in links and URLs for an entry ({ id, documentId, ... }).
export const entryKey = (entry) => entry?.documentId ?? entry?.id;

