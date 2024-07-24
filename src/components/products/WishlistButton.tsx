"use client";

import * as actions from "@/actions";
import { useWishlistContext } from "@/app/contexts/WishlistContext";
import { useEffect, useOptimistic } from "react";
import { PiHeart, PiHeartFill } from "react-icons/pi";
import { debounce } from "lodash";

interface WishlistButtonProps {
  slug: string;
  sku: string;
  isInWishlist: boolean;
  wishlistCount: number;
}

export default function WishlistButton({
  slug,
  sku,
  isInWishlist,
  wishlistCount,
}: WishlistButtonProps) {
  const { setWishlistCount, wishlistCount: stateCount } = useWishlistContext();
  const [optimisticWishlistItem, updateOptimisticWishlistItem] = useOptimistic(
    isInWishlist,
    (prevState: boolean, newState: boolean) => {
      newState = !prevState;
      return newState;
    }
  );

  const debouncedUpdateCount = debounce((dbWishlistCount, setWishlistCount) => {
    setWishlistCount(dbWishlistCount);
  }, 2500);

  useEffect(() => {
    if (stateCount !== wishlistCount) {
      debouncedUpdateCount(wishlistCount, setWishlistCount);
    }

    return () => {
      debouncedUpdateCount.cancel();
    };
  }, [stateCount, wishlistCount, setWishlistCount, debouncedUpdateCount]);

  return (
    <form
      onClick={() => {
        setWishlistCount((prevCount) =>
          optimisticWishlistItem ? prevCount - 1 : prevCount + 1
        );
      }}
      action={async () => {
        updateOptimisticWishlistItem(isInWishlist);
        await actions.toggleWishlistProduct(slug, sku);
      }}
    >
      <button
        type="submit"
        className="flex focus:outline-none items-center gap-1 group"
      >
        {optimisticWishlistItem ? (
          <PiHeartFill className="w-4 h-4 text-amber-500" />
        ) : (
          <PiHeart className="w-4 h-4" />
        )}
        <span
          className={`group-hover:underline group-focus:underline ${
            optimisticWishlistItem ? "text-amber-600" : ""
          }`}
        >
          Wishlist{optimisticWishlistItem ? "ed" : ""}
        </span>
      </button>
    </form>
  );
}
