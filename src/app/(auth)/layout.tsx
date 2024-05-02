import "../globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "../providers";
import Button from "@/components/ui/Button";
import paths from "@/lib/paths";
import type { Metadata } from "next";

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
      <body>
        <Providers>
          <main className="flex h-screen font-serif text-sm text-zinc-800 justify-center items-center px-4 bg-gradient-to-r from-zinc-800 to-zinc-700">
            <section className="flex flex-col gap-6">
              <div>
                <Button type="secondary" href={paths.home()}>
                  &larr; Back to shop
                </Button>
              </div>
              {children}
            </section>
          </main>
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
