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
    <section className="max-w-5xl mx-auto">
      <HeadingSecondary>Your orders</HeadingSecondary>
      <div className="mt-12">
        <Suspense fallback={<UserOrdersSkeleton />}>
          <UserOrders searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
