import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { UserLayoutWrapper } from "@/components/UserLayoutWrapper";
import { UserWebSocketProvider } from "@/components/UserWebSocketProvider";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://feel-it.com"),
  title: {
    default: "Feel It | Premium Fragrance E‑Boutique",
    template: "%s | Feel It",
  },
  description:
    "Discover a curated collection of modern, long-lasting perfumes crafted for every mood, moment, and city. Shop premium fragrances for men and women with free shipping on orders over Rs. 3,999.",
  keywords: [
    "premium perfume",
    "luxury fragrance",
    "perfume online",
    "eau de parfum",
    "men perfume",
    "women perfume",
    "Feel It",
    "premium fragrance Pakistan",
  ],
  authors: [{ name: "Feel It" }],
  creator: "Feel It",
  publisher: "Feel It",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://feel-it.com",
    siteName: "Feel It",
    title: "Feel It | Premium Fragrance E‑Boutique",
    description:
      "Discover a curated collection of modern, long-lasting perfumes crafted for every mood, moment, and city.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feel It | Premium Fragrance E‑Boutique",
    description:
      "Discover a curated collection of modern, long-lasting perfumes crafted for every mood, moment, and city.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} bg-neutral-50 text-neutral-900 antialiased`}
        suppressHydrationWarning
      >
        <UserWebSocketProvider>
          <CartProvider>
            <UserLayoutWrapper>{children}</UserLayoutWrapper>
          </CartProvider>
        </UserWebSocketProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#1a1a1a",
              border: "1px solid #e5e5e5",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "14px",
              fontFamily: "var(--font-sans)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
