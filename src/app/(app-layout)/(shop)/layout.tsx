import { FilterProvider } from "@/app/contexts/FilterContext";
import Navbar from "@/components/navigation/Navbar";
import { Suspense } from "react";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <FilterProvider>
        <Navbar mode="shop" />
        <main className="bg-white text-zinc-800 py-8 min-h-[65vh]">
          {children}
        </main>
      </FilterProvider>
    </Suspense>
  );
}
