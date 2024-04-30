import paths from "@/lib/paths";
import Link from "next/link";
import HeaderFeatureRow from "./HeaderFeatureRow";
import HeaderAuth from "./HeaderAuth";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="bg-zinc-800 relative text-zinc-50 tracking-[0.2em] p-12 tab:p-8 mob:p-5 grid grid-cols-3 tab:grid-cols-2 justify-items-center gap-y-20 tab:gap-y-10 mob-lg:gap-y-4 items-center tab:justify-items-end z-30">
      <span className="tab:hidden">&nbsp;</span>
      <Logo />
      <HeaderAuth />
      <Link
        href={paths.home()}
        className="uppercase text-5xl tracking-[0.25em] mob-lg:text-xl focus:outline-none focus:text-amber-200 text-zinc-200 justify-self-start tab-xl:text-4xl mob-sm:text-base"
      >
        <h1>Luminorix</h1>
      </Link>
      <HeaderFeatureRow />
    </header>
  );
}
