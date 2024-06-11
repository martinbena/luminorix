import DiscountSection from "@/components/home/DiscountSection";
import NewestProducts from "@/components/products/NewestProducts";
import ProductRowSkeleton from "@/components/products/ProductRowSkeleton";
import TopDiscounts from "@/components/products/TopDiscounts";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <DiscountSection />

      <Suspense
        fallback={<ProductRowSkeleton gridSize="large" numItems={3} hasTitle />}
      >
        <NewestProducts />
      </Suspense>

      <Suspense
        fallback={<ProductRowSkeleton gridSize="small" numItems={4} hasTitle />}
      >
        <TopDiscounts />
      </Suspense>
    </>
  );
}
