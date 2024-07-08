import HeadingSecondary from "@/components/ui/HeadingSecondary";
import UserOrders from "@/components/user/UserOrders";
import UserOrdersSkeleton from "@/components/user/UserOrdersSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Orders",
};

export default function UserOrdersPage() {
  return (
    <>
      <HeadingSecondary>Your orders</HeadingSecondary>
      <section className="mt-12 max-w-5xl mx-auto">
        <Suspense fallback={<UserOrdersSkeleton />}>
          <UserOrders />
        </Suspense>
      </section>
    </>
  );
}
