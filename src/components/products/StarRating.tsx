"use client";

import { MAX_RATING } from "@/lib/constants";
import { useState } from "react";
import Star from "./Star";

export default function StarRating() {
  const [rating, setRating] = useState<number>(0);
  const [tempRating, setTempRating] = useState<number>(0);

  function handleRating(rating: number): void {
    setRating(rating);
  }
  return (
    <div className="flex items-center gap-4">
      <div className="flex">
        {Array.from({ length: MAX_RATING }, (_, i) => (
          <Star
            key={i}
            isFull={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>
      {(tempRating > 0 || rating > 0) && (
        <p className="font-sans text-lg">{tempRating || rating}</p>
      )}

      <input type="hidden" name="rating" id="rating" value={rating} />
    </div>
  );
}
