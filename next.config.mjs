import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/5a72nvbtu/**",
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    // Drop debug logging from production builds, keep errors.
    removeConsole: process.env.NODE_ENV !== "development" && { exclude: ["error"] },
  },
  // Old page URLs. Renamed sections with an id are redirected in src/middleware.js.
  async redirects() {
    return [
      { source: "/category", destination: "/products", permanent: true },
      { source: "/items", destination: "/new-arrivals", permanent: true },
    ];
  },
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.js", // service worker source
  swDest: "public/sw.js", // compiled service worker, registered at /sw.js
  disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
});

export default withSerwist(nextConfig);
