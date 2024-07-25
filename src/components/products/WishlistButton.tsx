"use client";

import * as actions from "@/actions";
import { useWishlistContext } from "@/app/contexts/WishlistContext";
import { useEffect, useOptimistic } from "react";
import { PiHeart, PiHeartFill } from "react-icons/pi";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { SkeletonBlock } from "skeleton-elements/react";
import { SKELETON_EFFECT } from "@/lib/constants";

interface WishlistObject {
  user: string;
  wishlistItems: string[];
}

interface WishlistButtonProps {
  slug: string;
  sku: string;
  wishlistItems: WishlistObject[];
}

function isItemInWishlist(
  userId: string,
  sku: string,
  wishlistData: WishlistObject[]
) {
  const userWishlist = wishlistData.find((user) => user.user === userId);
  if (userWishlist) {
    return userWishlist.wishlistItems.includes(sku);
  }
  return false;
}

function getWishlistItemCount(userId: string, wishlistData: WishlistObject[]) {
  const userWishlist = wishlistData.find((user) => user.user === userId);

  if (userWishlist) {
    return userWishlist.wishlistItems.length;
  }

  return 0;
}

export default function WishlistButton({
  slug,
  sku,
  wishlistItems,
}: WishlistButtonProps) {
  const { setWishlistCount, wishlistCount: stateCount } = useWishlistContext();
  const session = useSession();

  const isInWishlist = session.data?.user
    ? isItemInWishlist(session.data?.user._id.toString(), sku, wishlistItems)
    : false;

  const wishlistCount = session.data?.user
    ? getWishlistItemCount(session.data?.user._id.toString(), wishlistItems)
    : false;

  const [optimisticWishlistItem, updateOptimisticWishlistItem] = useOptimistic(
    isInWishlist,
    (prevState: boolean, newState: boolean) => {
      newState = !prevState;
      return newState;
    }
  );

  const debouncedUpdateCount = debounce((dbWishlistCount, setWishlistCount) => {
    setWishlistCount(dbWishlistCount);
  }, 3000);

  useEffect(() => {
    if (stateCount !== wishlistCount) {
      debouncedUpdateCount(wishlistCount, setWishlistCount);
    }

    return () => {
      debouncedUpdateCount.cancel();
    };
  }, [stateCount, wishlistCount, setWishlistCount, debouncedUpdateCount]);

  if (session.status === "loading")
    return (
      <div className="flex items-center gap-1">
        <SkeletonBlock
          tag="span"
          height="16px"
          width="16px"
          borderRadius="999px"
          effect={SKELETON_EFFECT}
        />
        <SkeletonBlock
          tag="span"
          height="20px"
          width="53px"
          borderRadius="6px"
          effect={SKELETON_EFFECT}
        />
      </div>
    );

  if (session.data?.user) {
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
  } else {
    return null;
  }
}
