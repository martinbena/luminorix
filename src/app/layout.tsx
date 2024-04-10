import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/footer/Footer";

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
        <div className="max-w-8xl mx-auto py-16 dt-xl:max-w-seventy">
          <Header />
          <div className="grid grid-cols-[minmax(250px,_2fr)_11fr] min-h-[65vh]">
            <aside className="bg-white">
              <Navigation />
            </aside>
            <main className="bg-white text-zinc-800 px-8 py-4">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
