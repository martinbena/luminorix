import "../globals.css";
import "skeleton-elements/css";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navigation/Navbar";
import { Toaster } from "react-hot-toast";
import Providers from "../providers";
import MobileControlPanel from "@/components/navigation/MobileControlPanel";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Luminorix | Administration",
  description:
    "Access the secure admin section to manage critical aspects of the platform. Gain control over settings, product editing, and data management tools. This section is reserved for authorized administrators to oversee platform operations efficiently.",
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
              <Navbar>
                <MobileControlPanel mode="admin" />
                <aside className="tab:hidden">
                  <Navigation mode="admin" />
                </aside>
              </Navbar>
              <main className="bg-white text-zinc-800 p-8 min-h-[65vh]">
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
