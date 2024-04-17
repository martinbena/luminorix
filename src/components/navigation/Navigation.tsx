import paths from "@/lib/paths";
import NavigationLink from "./NavigationLink";

export default function Navigation() {
  const categoryLinks = [
    {
      href: paths.productShowAll(),
      description: "All sortiment",
    },
    {
      href: paths.productShowAll(),
      description: "Men's fashion",
    },
    {
      href: paths.productShowAll(),
      description: "Women's fashion",
    },
    {
      href: paths.productShowAll(),
      description: "Jewelry",
    },
    {
      href: paths.productShowAll(),
      description: "Watches",
    },
    {
      href: paths.productShowAll(),
      description: "Sunglasses",
    },
  ];

  const tagLinks = [
    {
      href: paths.tagShow("discounts"),
      description: "Discounts",
    },
    {
      href: paths.tagShow("market"),
      description: "Market",
    },
    {
      href: paths.tagShow("free-shipping"),
      description: "Free Shipping",
    },
  ];
  return (
    <nav className="tracking-[0.2em] text-zinc-800 bg-white uppercase child:py-6 child:flex child:flex-col child:gap-2">
      <ul className="bg-amber-200 child-hover:bg-zinc-800 child-hover:text-amber-200">
        {categoryLinks.map((link) => (
          <NavigationLink
            key={link.description}
            href={link.href}
            description={link.description}
          />
        ))}
      </ul>
      <ul className="child-hover:bg-zinc-800 child-hover:text-amber-200 bg-zinc-50">
        {tagLinks.map((link) => (
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
