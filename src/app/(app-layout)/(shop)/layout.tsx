import Navbar from "@/components/navigation/Navbar";
import MobileControlPanel from "@/components/navigation/MobileControlPanel";
import Navigation from "@/components/navigation/Navigation";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar>
        <MobileControlPanel />
        <aside className="tab:hidden">
          <Navigation mode="shop" />
        </aside>
      </Navbar>

      <main className="bg-white text-zinc-800 py-8 min-h-[65vh]">
        {children}
      </main>
    </>
  );
}
