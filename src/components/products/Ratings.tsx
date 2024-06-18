"use client";

import { Rating } from "@/models/Product";
import Image from "next/image";
import UserImagePlaceholder from "/public/images/UserImagePlaceholder.jpg";
import Stars from "./Stars";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import Button from "../ui/Button";

interface RatingsProps {
  ratings: Rating[];
}

export default function Ratings({ ratings }: RatingsProps) {
  const [showAll, setShowAll] = useState(false);

  const ratingsWithComments = ratings.filter((rating) => rating.comment);

  const displayedRatings = showAll
    ? ratingsWithComments
    : ratingsWithComments.slice(0, 2);

  if (!ratingsWithComments.length)
    return <p>There are no reviews for this product yet.</p>;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 w-full">
      {displayedRatings.map((rating, index) => (
        <div key={index}>
          <div className="grid grid-cols-[1fr_3.5fr_1.5fr] mob:grid-cols-[1.2fr_2.2fr_1.8fr] gap-y-2 mob:gap-x-2 mob:gap-y-3">
            <Image
              src={rating.postedBy.image ?? UserImagePlaceholder}
              alt={`Image of the user ${rating.postedBy.name}`}
              width={48}
              height={48}
              className="rounded-full justify-self-center mob:justify-self-start"
            />
            <div className="flex flex-col justify-between">
              <p className="text-base">{rating.postedBy.name}</p>
              <Stars rating={rating.rating} />
            </div>
            <p className="self-end mob:text-xs">
              {formatDistanceToNow(new Date(rating.createdAt))} ago
            </p>
            <span className="mob:hidden">&nbsp;</span>
            <div className="text-base mob:col-span-3">{rating.comment}</div>
          </div>
        </div>
      ))}
      {ratings.length > 2 && (
        <div className="w-96">
          <Button type="tertiary" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Less" : "Show All"}
          </Button>
        </div>
      )}
    </div>
  );
}
