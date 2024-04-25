import "./globals.css";
import "skeleton-elements/css";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navigation/Navbar";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Luminorix",
  description:
    "Discover a world of opulence and elegance at Luminorix, where luxury meets sophistication. Shop exquisite fashion, jewelry, home decor, and more from the world's most prestigious brands. Indulge in the finest selection of high-end products, curated for the discerning connoisseur. Elevate your lifestyle with Luminorix today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-serif bg-amber-50 text-sm">
        <Providers>
          <div className="max-w-8xl mx-auto py-16 dt-xl:max-w-seventy dt-lg:p-8 dt:p-0">
            <Header />
            <div className="grid grid-cols-[minmax(250px,_2fr)_minmax(550px,_11fr)] tab:grid-cols-1">
              <div className="bg-zinc-50 overflow-hidden">
                <Navbar />
              </div>
              <main className="bg-white text-zinc-800 pt-8 min-h-[65vh]">
                {children}
              </main>
            </div>
            <Footer />
          </div>
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
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
