import type { Metadata } from "next";
import Navbar from "@/components/navigation/Navbar";
import MobileControlPanel from "@/components/navigation/MobileControlPanel";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Luminorix | Administration",
  description:
    "Access the secure admin section to manage critical aspects of the platform. Gain control over settings, product editing, and data management tools. This section is reserved for authorized administrators to oversee platform operations efficiently.",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar>
        <MobileControlPanel mode="user" />
        <aside className="tab:hidden">
          <Navigation mode="user" />
        </aside>
      </Navbar>
      <main className="bg-white text-zinc-800 p-8 min-h-[65vh]">
        {children}
      </main>
    </>
  );
}
