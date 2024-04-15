import paths from "@/paths";
import Link from "next/link";
import { PiListThin } from "react-icons/pi";

export default function Navigation() {
  return (
    <>
      <div className="hidden tab:block bg-amber-100 px-12 py-2 tab:px-8 mob:px-5">
        <button>
          <PiListThin className="h-12 w-12 fill-zinc-800" />
        </button>
      </div>
      <nav className="tracking-[0.2em] text-zinc-800 bg-white uppercase tab:hidden child:py-6 child:flex child:flex-col child:gap-2 mob-lg:hidden">
        <ul className="bg-amber-200 child-hover:bg-zinc-800 mob-lg:hidden child-hover:text-amber-200 child:pl-12 child:py-2.5">
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
            <Link href={paths.productShowAll()}>Jewelry</Link>
          </li>
          <li>
            <Link href={paths.productShowAll()}>Watches</Link>
          </li>
          <li>
            <Link href={paths.productShowAll()}>Sunglasses</Link>
          </li>
        </ul>
        <ul className="child:pl-12 child:py-2.5 mob-lg:hidden child-hover:bg-zinc-800 child-hover:text-amber-200 bg-zinc-50">
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
    </>
  );
}
