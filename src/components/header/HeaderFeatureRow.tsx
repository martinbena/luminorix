"use client";

import {
  PiHeartThin,
  PiMagnifyingGlassThin,
  PiShoppingCartSimpleThin,
} from "react-icons/pi";
import HeaderFeature from "./HeaderFeature";
import paths from "@/paths";
import { useState } from "react";

import Searchbar from "./Searchbar";

export default function HeaderFeatureRow() {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  function toggleSearchVisibility() {
    setIsSearchVisible((visible) => !visible);

    document.body.style.overflow = isSearchVisible ? "auto" : "hidden";
  }
  return (
    <>
      <div className="flex gap-16 tab:gap-8 mob-sm:gap-3 col-span-2 tab:col-span-1 justify-self-end">
        <div>
          <HeaderFeature onClick={toggleSearchVisibility}>
            <PiMagnifyingGlassThin /> <span>Search</span>
          </HeaderFeature>
        </div>
        <div>
          <HeaderFeature link={paths.userWishlist()}>
            <PiHeartThin /> <span>Wishlist</span>
          </HeaderFeature>
        </div>
        <div>
          <HeaderFeature link={paths.cart()}>
            <PiShoppingCartSimpleThin />{" "}
            <div>
              <p className="text-base">Cart</p>{" "}
              <span className="font-sans font-semibold tracking-wider dt-sm:text-sm">
                is empty
              </span>
            </div>
          </HeaderFeature>
        </div>

        <Searchbar
          isVisible={isSearchVisible}
          onToggleVisibility={toggleSearchVisibility}
          onSetVisibility={setIsSearchVisible}
        />
      </div>
    </>
  );
}
