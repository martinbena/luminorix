import ProductRowSkeleton from "@/components/products/ProductRowSkeleton";
import SearchedProducts from "@/components/products/SearchedProducts";
import HeadingSecondary from "@/components/ui/HeadingSecondary";
import paths from "@/lib/paths";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface SearchResultsPageProps {
  searchParams: {
    term: string;
  };
}

export default async function SearchResultsPage({
  searchParams,
}: SearchResultsPageProps) {
  const { term } = searchParams;

  if (!term) {
    redirect(paths.home());
  }

  return (
    <section className="[&>*:nth-child(1)]:px-8">
      <HeadingSecondary>Search results</HeadingSecondary>
      <Suspense fallback={<ProductRowSkeleton gridSize="large" numItems={6} />}>
        <SearchedProducts term={term} />
      </Suspense>
    </section>
  );
}
