import "../globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "../providers";
import Button from "@/components/ui/Button";
import paths from "@/lib/paths";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Luminorix",
    default: "Authentication | Luminorix",
  },
};

export default function AuthLayout({
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
              <div className="bg-white px-24 py-12 mob-lg:p-12 mob-sm:p-6">
                {children}
              </div>
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
