import "./globals.css";
import "skeleton-elements/css";
import "photoswipe/dist/photoswipe.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import { Playfair_Display, Raleway } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
});

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Luminorix",
    default: "Welcome | Luminorix",
  },
  description:
    "Discover a world of opulence and elegance at Luminorix, where luxury meets sophistication. Shop exquisite fashion, jewelry, home decor, and more from the world's most prestigious brands. Indulge in the finest selection of high-end products, curated for the discerning connoisseur. Elevate your lifestyle with Luminorix today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${raleway.variable}`}
    >
      <body className="font-serif bg-amber-50 text-sm">
        <Providers>
          {children}
          <div id="overlay" />
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  padding: "16px",
                  color: "#27272a",
                  backgroundColor: "#fef3c7",
                },
                iconTheme: {
                  primary: "#f59e0b",
                  secondary: "#fef3c7",
                },
              },
              error: {
                style: {
                  padding: "16px",
                  color: "#27272a",
                  backgroundColor: "#fef3c7",
                },
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fef3c7",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
