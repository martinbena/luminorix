"use client";

import * as actions from "@/actions";
import { useOptimistic } from "react";
import { PiHeart, PiHeartFill } from "react-icons/pi";

interface WishlistButtonProps {
  slug: string;
  sku: string;
  isInWishlist: boolean;
}

export default function WishlistButton({
  slug,
  sku,
  isInWishlist,
}: WishlistButtonProps) {
  const [optimisticWishlistItem, updateOptimisticWishlistItem] = useOptimistic(
    isInWishlist,
    (prevState: boolean, newState: boolean) => {
      newState = !prevState;
      return newState;
    }
  );

  return (
    <form
      action={async () => {
        updateOptimisticWishlistItem(isInWishlist);
        await actions.toggleWishlistProduct(slug, sku);
      }}
    >
      <button type="submit" className="flex items-center gap-1 group">
        {optimisticWishlistItem ? (
          <PiHeartFill className="w-4 h-4 text-amber-500" />
        ) : (
          <PiHeart className="w-4 h-4" />
        )}
        <span className="group-hover:underline">
          Wishlist{optimisticWishlistItem ? "ed" : ""}
        </span>
      </button>
    </form>
  );
}
