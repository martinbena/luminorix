import NavigationLink from "./NavigationLink";
import {
  adminLinks,
  categoryLinks,
  tagLinks,
  userLinks,
} from "@/lib/navLinkCategories";

interface NavigationProps {
  mode: "shop" | "user" | "admin";
}

export default function Navigation({ mode }: NavigationProps) {
  return (    
      <nav className="tracking-[0.2em] text-zinc-800 bg-white uppercase child:py-6 child:flex child:flex-col child:gap-2">
        {mode === "shop" && (
          <ul className="bg-amber-200 child-hover:bg-zinc-800 child-hover:text-amber-200">
            {categoryLinks.map((link) => (
              <NavigationLink
                key={link.description}
                href={link.href}
                description={link.description}
              />
            ))}
          </ul>
        )}
        <ul className="child-hover:bg-zinc-800 child-hover:text-zinc-50 bg-amber-100">
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

          {mode === "user" &&
            userLinks.map((link) => (
              <NavigationLink
                key={link.description}
                href={link.href}
                description={link.description}
              />
            ))}
        </ul>
      </nav>   
  );
}
