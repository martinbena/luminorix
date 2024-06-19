"use client";

import * as actions from "@/actions";
import { useWishlistContext } from "@/app/contexts/WishlistContext";
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
  const { setWishlistCount } = useWishlistContext();
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
        !isInWishlist && setWishlistCount((prevCount) => prevCount + 1);
        isInWishlist && setWishlistCount((prevCount) => prevCount - 1);
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
