// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "ik.imagekit.io",
//         pathname: "/5a72nvbtu/**",
//       },
//     ],
//   },
// };

// export default nextConfig;

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
  reactStrictMode: true, // Enable React strict mode for improved error handling
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  output: 'standalone', // Enable standalone output for Docker deployment
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.js", // service worker source
  swDest: "public/sw.js", // compiled service worker, registered at /sw.js
  disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
});

export default withSerwist(nextConfig);
