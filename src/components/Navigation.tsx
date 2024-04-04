import paths from "@/paths";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="tracking-[0.2em] text-zinc-800 bg-white uppercase child:py-6 child:flex child:flex-col child:gap-2">
      <ul className="bg-amber-200 child-hover:bg-zinc-800 child-hover:text-amber-200 child:pl-12 child:py-2.5">
        <li>
          <Link href={paths.productShowAll()}>All sortiment</Link>
        </li>
        <li>
          <Link href={paths.productShowAll()}>Men&apos;s fashion</Link>
        </li>
        <li>
          <Link href={paths.productShowAll()}>Women&apos;s fashion</Link>
        </li>
        <li>
          <Link href={paths.productShowAll()}>Jewellery</Link>
        </li>
        <li>
          <Link href={paths.productShowAll()}>Watches</Link>
        </li>
        <li>
          <Link href={paths.productShowAll()}>Sunglasses</Link>
        </li>
      </ul>
      <ul className="child:pl-12 child:py-2.5 child-hover:bg-zinc-800 child-hover:text-amber-200">
        <li>
          <Link href={paths.tagShow("discounts")}>Discounts</Link>
        </li>
        <li>
          <Link href={paths.tagShow("market")}>Market</Link>
        </li>
        <li>
          <Link href={paths.tagShow("free-shipping")}>Free shipping</Link>
        </li>
      </ul>
    </nav>
  );
}
