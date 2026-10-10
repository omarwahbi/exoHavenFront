import { NextResponse } from "next/server";

// Old links use numeric ids (/item/123). Strapi 5 changes an entry's numeric id each
// time it is republished, so pages use the permanent documentId instead. Redirect old
// URLs to it here, before the page starts streaming, so browsers and search engines
// get a real 308. The API resolves the old id (see the backend's legacy_id).

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.exohaven-iq.com";

// page section -> API collection
const COLLECTIONS = { item: "items", items: "sub-categories", subCategory: "categories" };

export async function middleware(request) {
  const [, section, id] = request.nextUrl.pathname.split("/");
  const collection = COLLECTIONS[section];
  if (!collection) return NextResponse.next();

  try {
    const res = await fetch(`${API_URL}/api/${collection}/${id}?fields[0]=name`);
    if (res.ok) {
      const { data } = await res.json();
      if (data?.documentId) {
        const url = request.nextUrl.clone();
        url.pathname = `/${section}/${data.documentId}`;
        return NextResponse.redirect(url, 308);
      }
    }
  } catch {
    // API unreachable: let the page handle the numeric id.
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/item/:id(\\d+)", "/items/:id(\\d+)", "/subCategory/:id(\\d+)"],
};
