import MarketInfo from "@/components/products/MarketInfo";
import MarketItems from "@/components/products/MarketItems";
import ProductRowSkeleton from "@/components/products/ProductRowSkeleton";
import HeadingSecondary from "@/components/ui/HeadingSecondary";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Market",
  description:
    "Explore and browse user listings on our market page. Buy and sell items exclusively from our store current product catalog. Join the community and find great deals on your favorite products.",
};

export default function MarketPage() {
  return (
    <section className="px-8 mob:px-4">
      <MarketInfo />
      <HeadingSecondary>Market listings</HeadingSecondary>
      <Suspense fallback={<ProductRowSkeleton numItems={6} gridSize="large" />}>
        <MarketItems />
      </Suspense>
    </section>
  );
}
