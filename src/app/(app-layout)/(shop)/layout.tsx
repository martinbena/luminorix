import Navbar from "@/components/navigation/Navbar";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar mode="shop" />
      <main className="bg-white text-zinc-800 py-8 min-h-[65vh]">
        {children}
      </main>
    </>
  );
}
