import { NextResponse } from "next/server";
import { API_URL } from "@/utils/apiUrl";

// Redirects old page URLs to current ones with a 308, before the page renders:
//
// - Renamed sections: /item/x -> /products/x, /subCategory/x -> /categories/x,
//   /items/x -> /sub-categories/x. (/category and /items are in next.config.mjs.)
// - Numeric ids from before Strapi 5 (/products/123): Strapi 5 changes an entry's
//   numeric id each time it is republished, so pages use the permanent documentId.
//   The API resolves the old id (see the backend's legacy_id).

// current page section -> API collection
const COLLECTIONS = { products: "items", categories: "categories", "sub-categories": "sub-categories" };
// old page section -> current one
const RENAMED = { item: "products", subCategory: "categories", items: "sub-categories" };

const toDocumentId = async (collection, id) => {
  if (!/^\d+$/.test(id)) return id;
  try {
    // Don't let a slow API hold up the page: give up after 3 seconds.
    const res = await fetch(`${API_URL}/api/${collection}/${id}?fields[0]=name`, {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const { data } = await res.json();
      if (data?.documentId) return data.documentId;
    }
  } catch {
    // API slow or unreachable: keep the numeric id, the page resolves it too.
  }
  return id;
};

export async function middleware(request) {
  const [, requested, id] = request.nextUrl.pathname.split("/");
  const section = RENAMED[requested] ?? requested;
  const collection = COLLECTIONS[section];
  if (!collection || !id) return NextResponse.next();

  const documentId = await toDocumentId(collection, id);
  if (section === requested && documentId === id) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${section}/${documentId}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    "/item/:id",
    "/items/:id",
    "/subCategory/:id",
    "/products/:id(\\d+)",
    "/categories/:id(\\d+)",
    "/sub-categories/:id(\\d+)",
  ],
};
