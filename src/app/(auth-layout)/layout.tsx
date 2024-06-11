import "../globals.css";
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
  );
}
