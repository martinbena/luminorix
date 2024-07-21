import { AdminAllProductsPageProps } from "@/app/(app-layout)/(admin)/admin/products/page";
import TableSkeleton from "@/components/data-tables/TableSkeleton";
import Button from "@/components/ui/Button";
import HeadingSecondary from "@/components/ui/HeadingSecondary";
import UserMarketItems from "@/components/user/UserMarketItems";
import paths from "@/lib/paths";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Products",
};

export default function UserMarketItemsPage({
  searchParams,
}: AdminAllProductsPageProps) {
  return (
    <section className="max-w-5xl mx-auto [&>*:nth-child(1)]:-mb-6">
      <HeadingSecondary>Your market items</HeadingSecondary>
      <div className="mt-12 py-8 mob:mt-8 [&>*:nth-child(2)]:mt-12">
        <Button type="secondary" href={paths.marketItemCreate()}>
          Add new items
        </Button>

        <Suspense fallback={<TableSkeleton />}>
          <UserMarketItems searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
