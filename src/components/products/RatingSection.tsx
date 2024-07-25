"use client";

import paths from "@/lib/paths";
import AddEditRatingForm from "./AddEditRatingForm";
import RatingDistribution from "./RatingDistribution";
import Link from "next/link";
import Ratings from "./Ratings";
import { Rating } from "@/models/Product";
import { useSession } from "next-auth/react";
import RatingFormSkeleton from "./RatingFormSkeleton";

interface RatingSectionsProps {
  ratings: Rating[];
  averageRating: number;
  productSlug: string;
}

export default function RatingSection({
  ratings,
  averageRating,
  productSlug,
}: RatingSectionsProps) {
  const session = useSession();
  const user = session.data?.user;
  const hasUserRated = user
    ? ratings.some((rating) => rating.postedBy._id.toString() === user._id)
    : false;

  return (
    <section className="grid grid-cols-2 mt-16 mb-4 gap-16 tab-xl:gap-4 tab:grid-cols-1 tab:gap-16">
      <div className="flex flex-col gap-8">
        <RatingDistribution ratings={ratings} averageRating={averageRating} />
        {session.status === "loading" && <RatingFormSkeleton />}
        {user ? (
          !hasUserRated ? (
            <AddEditRatingForm productSlug={productSlug} />
          ) : (
            <p className="text-base text-center">
              You have already rated this product. Visit your{" "}
              <Link
                className="underline text-amber-600"
                href={paths.userReviews()}
              >
                profile
              </Link>{" "}
              for edit.
            </p>
          )
        ) : null}
      </div>
      <Ratings ratings={JSON.parse(JSON.stringify(ratings))} />
    </section>
  );
}
