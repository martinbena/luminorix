import HeadingSecondary from "@/components/ui/HeadingSecondary";
import UserOrders from "@/components/user/UserOrders";
import UserOrdersSkeleton from "@/components/user/UserOrdersSkeleton";
import { Metadata } from "next";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Orders",
};

export interface UserOrdersPageProps {
  searchParams: ReadonlyURLSearchParams & { deliveryStatus: string };
}

export default function UserOrdersPage({ searchParams }: UserOrdersPageProps) {
  return (
    <>
      <HeadingSecondary>Your orders</HeadingSecondary>
      <section className="mt-12 max-w-5xl mx-auto">
        <Suspense fallback={<UserOrdersSkeleton />}>
          <UserOrders searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
