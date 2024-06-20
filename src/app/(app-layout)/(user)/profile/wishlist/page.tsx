import HeadingSecondary from "@/components/ui/HeadingSecondary";
import Wishlist from "@/components/user/Wishlist";
import WishlistSkeleton from "@/components/user/WishlistSkeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default async function UserWishlistPage() {
  return (
    <>
      <HeadingSecondary>Your Wishlist</HeadingSecondary>
      <div className="mt-12">
        <Suspense fallback={<WishlistSkeleton />}>
          <Wishlist />
        </Suspense>
      </div>
    </>
  );
}
