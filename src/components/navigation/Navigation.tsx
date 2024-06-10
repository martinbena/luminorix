import paths from "@/lib/paths";
import NavigationLink from "./NavigationLink";
import {
  adminLinks,
  categoryLinks,
  tagLinks,
  userLinks,
} from "@/lib/navLinkCategories";
import { Suspense } from "react";

export interface NavigationProps {
  mode: "shop" | "user" | "admin";
}

export default function Navigation({ mode }: NavigationProps) {
  return (
    <nav className="tracking-[0.2em] text-zinc-800 transition-all duration-1000 ease-out bg-white uppercase child:py-6 child:flex child:flex-col child:gap-2">
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

          {mode === "admin" &&
            adminLinks.map((link) => (
              <NavigationLink
                key={link.description}
                href={link.href}
                description={link.description}
              />
            ))}

          {mode === "user" && (
            <NavigationLink
              href={paths.productShowAll()}
              description="Back to shop"
            />
          )}
          {mode === "user" &&
            userLinks.map((link) => (
              <NavigationLink
                key={link.description}
                href={link.href}
                description={link.description}
              />
            ))}
        </ul>
      </Suspense>
    </nav>
  );
}
