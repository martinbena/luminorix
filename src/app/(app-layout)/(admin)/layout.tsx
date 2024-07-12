import type { Metadata } from "next";
import Navbar from "@/components/navigation/Navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | Administration",
    default: "Dashboard | Administration",
  },
  description:
    "Access the secure admin section to manage critical aspects of the platform. Gain control over settings, product editing, and data management tools. This section is reserved for authorized administrators to oversee platform operations efficiently.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar mode="admin" />
      <main className="bg-white text-zinc-800 p-8 mob-lg:px-4 min-h-[65vh]">
        <section className="max-w-5xl mx-auto">{children}</section>
      </main>
    </>
  );
}
