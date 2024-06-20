import HeadingSecondary from "@/components/ui/HeadingSecondary";
import Reviews from "@/components/user/Reviews";
import ReviewsSkeleton from "@/components/user/ReviewsSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reviews",
};

export default function UserReviewsPage() {
  return (
    <>
      <HeadingSecondary>Your reviews</HeadingSecondary>
      <div className="mt-12">
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews />
        </Suspense>
      </div>
    </>
  );
}
