import AllProducts from "@/components/products/AllProducts";
import MostSoldProducts from "@/components/products/MostSoldProducts";
import MostSoldProductsSkeleton from "@/components/products/MostSoldProductsSkeleton";
import ProductRowSkeleton from "@/components/products/ProductRowSkeleton";
import { getCategoryBySlug } from "@/db/queries/categories";
import { ProductSearchParams } from "@/db/queries/queryOptions";
import { Suspense } from "react";

export interface AllProductsPageProps {
  searchParams: ProductSearchParams;
}

export async function generateMetadata({ searchParams }: AllProductsPageProps) {
  const { category: categorySlug } = searchParams;
  const category = await getCategoryBySlug(categorySlug);

  return {
    title: `${category?.title ?? "All Sortiment"}`,
  };
}

export default async function AllProductsPage({
  searchParams,
}: AllProductsPageProps) {
  const { category } = searchParams;
  return (
    <>
      <Suspense fallback={<MostSoldProductsSkeleton />}>
        <MostSoldProducts category={category} />
      </Suspense>
      <Suspense
        fallback={
          <ProductRowSkeleton gridSize="large" hasTitle numItems={12} />
        }
      >
        <AllProducts searchParams={searchParams} />
      </Suspense>
    </>
  );
}
