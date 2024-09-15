import { Inter } from "next/font/google";
import { CartProvider } from "./context/CartContext";
import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ExoHaven",
  description: "For Selling all animals accessories",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-green1 flex flex-col min-h-screen`}
      >
        <CartProvider>
          <main className="flex flex-col h-screen">
            <Navbar />
            <div className=" flex-grow">{children}</div>
            <Footer />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
