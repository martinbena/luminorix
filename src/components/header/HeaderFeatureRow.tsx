"use client";

import {
  PiHeartThin,
  PiMagnifyingGlassThin,
  PiShoppingCartSimpleThin,
  PiXThin,
} from "react-icons/pi";
import HeaderFeature from "./HeaderFeature";
import paths from "@/paths";

export default function HeaderFeatureRow() {
  return (
    <>
      <div className="flex gap-16 tab:gap-8 mob-sm:gap-3">
        <div className="hidden tab:grid">
          <HeaderFeature>
            <PiMagnifyingGlassThin />
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
      </div>
    </>
  );
}
