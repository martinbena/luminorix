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

  const displayedRatings = showAll ? ratings : ratings.slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 w-full">
      {displayedRatings.map((rating, index) => (
        <div key={index}>
          <div className="grid grid-cols-[1fr_4fr_1fr] gap-y-2">
            <Image
              src={rating.postedBy.image ?? UserImagePlaceholder}
              alt={`Image of the user ${rating.postedBy.name}`}
              width={48}
              height={48}
              className="rounded-full justify-self-center"
            />
            <div className="flex flex-col gap-1">
              <p className="text-base">{rating.postedBy.name}</p>
              <Stars rating={rating.rating} />
            </div>
            <p className="self-end">
              {formatDistanceToNow(new Date(rating.createdAt))} ago
            </p>
            <span>&nbsp;</span>
            <div className="text-base">{rating.comment}</div>
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
