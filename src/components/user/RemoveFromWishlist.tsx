"use client";

import { PiX } from "react-icons/pi";
import { useWishlistContext } from "@/app/contexts/WishlistContext";

interface RemoveFromWishlistProps {
  slug: string;
  sku: string;
  onDelete: (sku: string, slug: string) => Promise<void>;
}

export default function RemoveFromWishlist({
  slug,
  sku,
  onDelete,
}: RemoveFromWishlistProps) {
  const { setWishlistCount } = useWishlistContext();
  return (
    <form
      onClick={() => setWishlistCount((prevCount) => prevCount - 1)}
      action={() => {
        onDelete(slug, sku);
      }}
    >
      <button type="submit" className="text-red-600 child:w-6 child:h-6">
        <PiX />
      </button>
    </form>
  );
}
