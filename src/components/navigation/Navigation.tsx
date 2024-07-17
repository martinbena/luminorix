import { categoryLinks, tagLinks } from "@/lib/navLinkCategories";
import paths from "@/lib/paths";
import { Suspense } from "react";
import {
  PiArrowBendDownLeftDuotone,
  PiArrowsCounterClockwiseDuotone,
  PiBellDuotone,
  PiChartBarDuotone,
  PiCubeDuotone,
  PiGridFourDuotone,
  PiHeartDuotone,
  PiNotepadDuotone,
  PiPackageDuotone,
  PiStarDuotone,
  PiUserDuotone,
  PiWrenchDuotone,
} from "react-icons/pi";
import NavigationLink from "./NavigationLink";

export interface NavigationProps {
  mode: "shop" | "user" | "admin";
}

export default function Navigation({ mode }: NavigationProps) {
  return (
    <nav
      className={`text-zinc-800 uppercase transition-all duration-1000 ease-out bg-white child:py-6 child:flex child:flex-col child:gap-2 ${
        mode === "shop" ? "tracking-[0.2em]" : "tracking-[0.15em]"
      }`}
    >
      <Suspense>
        {mode === "shop" && (
          <ul className="bg-amber-200 child-hover:bg-zinc-800 child-hover:text-amber-200">
            {categoryLinks.map((link) => (
              <NavigationLink
                key={link.description}
                href={link.href}
                description={link.description}
                activeClasses="bg-zinc-800 text-amber-200"
              />
            ))}
          </ul>
        )}
        <ul className="child-hover:bg-amber-200 bg-zinc-50">
          {mode === "shop" &&
            tagLinks.map((link) => (
              <NavigationLink
                key={link.description}
                href={link.href}
                description={link.description}
              />
            ))}

          {mode === "admin" && (
            <>
              <NavigationLink
                href={paths.admin()}
                description={"Dashboard"}
                icon={<PiChartBarDuotone />}
              />
              <NavigationLink
                href={paths.adminProductShow()}
                description={"Products"}
                icon={<PiCubeDuotone />}
              />
              <NavigationLink
                href={paths.adminCategoryShow()}
                description={"Categories"}
                icon={<PiGridFourDuotone />}
              />
              <NavigationLink
                href={paths.adminOrderShow()}
                description={"User orders"}
                icon={<PiNotepadDuotone />}
              />
            </>
          )}

          {mode === "user" && (
            <>
              <NavigationLink
                href={paths.productShowAll()}
                description="Back to shop"
                icon={<PiArrowBendDownLeftDuotone />}
              />
              <NavigationLink
                href={paths.userProfile()}
                description="Profile"
                icon={<PiUserDuotone />}
              />
              <NavigationLink
                href={paths.userSettings()}
                description="Settings"
                icon={<PiWrenchDuotone />}
              />
              <NavigationLink
                href={paths.userOrderShowAll()}
                description="Orders"
                icon={<PiPackageDuotone />}
              />
              <NavigationLink
                href={paths.userWishlist()}
                description="Wishlist"
                icon={<PiHeartDuotone />}
              />
              <NavigationLink
                href={paths.userMessages()}
                description="Messages"
                icon={<PiBellDuotone />}
              />
              <NavigationLink
                href={paths.userReviews()}
                description="Reviews"
                icon={<PiStarDuotone />}
              />
              <NavigationLink
                href={paths.userMarketItemShow()}
                description="Market items"
                icon={<PiArrowsCounterClockwiseDuotone />}
              />
            </>
          )}
        </ul>
      </Suspense>
    </nav>
  );
}
