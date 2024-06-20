"use client";

import {
  PiHeartThin,
  PiMagnifyingGlassThin,
  PiShoppingCartSimpleThin,
} from "react-icons/pi";
import HeaderFeature from "./HeaderFeature";
import paths from "@/lib/paths";
import { useEffect, useState } from "react";

import Searchbar from "./Searchbar";
import { useSession } from "next-auth/react";
import { ObjectId } from "mongoose";
import { useWishlistContext } from "@/app/contexts/WishlistContext";

export default function HeaderFeatureRow() {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const { wishlistCount, setWishlistCount } = useWishlistContext();
  const session = useSession();

  function toggleSearchVisibility(): void {
    setIsSearchVisible((visible) => !visible);

    document.body.style.overflow = isSearchVisible ? "auto" : "hidden";
  }

  useEffect(() => {
    async function fetchWishlistCount(userId: ObjectId) {
      if (userId) {
        try {
          const res = await fetch(`/api/wishlist/${userId}`);
          const data = await res.json();
          setWishlistCount(data.count);
        } catch (error) {
          setWishlistCount(0);
          console.error("Failed to fetch wishlist count:", error);
        }
      }
    }

    if (session.data?.user?._id) {
      fetchWishlistCount(session.data.user._id);
    }
  }, [session.data?.user?._id, setWishlistCount]);

  return (
    <>
      <div className="flex gap-16 tab:gap-8 mob-sm:gap-3 col-span-2 tab:col-span-1 justify-self-end">
        <HeaderFeature onClick={toggleSearchVisibility}>
          <PiMagnifyingGlassThin /> <span>Search</span>
        </HeaderFeature>

        {session.data?.user ? (
          <HeaderFeature link={paths.userWishlist()} count={wishlistCount}>
            <PiHeartThin /> <span>Wishlist</span>
          </HeaderFeature>
        ) : null}

        <HeaderFeature link={paths.cart()}>
          <PiShoppingCartSimpleThin />{" "}
          <div>
            <p className="text-base">Cart</p>{" "}
            <span className="font-sans font-semibold tracking-wider dt-sm:text-sm">
              is empty
            </span>
          </div>
        </HeaderFeature>

        <Searchbar
          isVisible={isSearchVisible}
          onToggleVisibility={toggleSearchVisibility}
          onSetVisibility={setIsSearchVisible}
        />
      </div>
    </>
  );
}
