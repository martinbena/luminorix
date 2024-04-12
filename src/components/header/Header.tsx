import paths from "@/paths";
import Image from "next/image";
import Link from "next/link";
import HeaderFeatureRow from "./HeaderFeatureRow";

export default function Header() {
  return (
    <header className="bg-zinc-800 relative text-zinc-50 tracking-[0.2em] p-12 mob-lg:p-8 mob:p-5 grid grid-cols-3 tab:grid-cols-2 justify-items-center gap-y-20 tab:gap-y-10 mob-lg:gap-y-4 items-center tab:justify-items-end">
      <span className="tab:hidden">&nbsp;</span>

      <div className="tab:justify-self-start">
        <Link href={paths.home()}>
          <Image
            src="/images/logo.png"
            width={128}
            height={128}
            alt="Logo of Luminorix"
            className="mob:h-24 mob:w-24"
          />
        </Link>
      </div>

      <div className="flex gap-20 tab-xl:gap-16 tab:gap-8 mob:gap-3">
        <Link href={paths.register()} className="hover:text-amber-200">
          Register
        </Link>
        <Link href={paths.login()} className="hover:text-amber-200">
          Login
        </Link>
      </div>

      <Link
        href={paths.home()}
        className="uppercase text-5xl tracking-[0.25em] mob-lg:text-xl text-zinc-200 justify-self-start tab-xl:text-4xl mob-sm:text-base"
      >
        Luminorix
      </Link>

      <input
        type="text"
        placeholder="Search..."
        className="py-4 px-5 tracking-[0.2em] w-80 dt-sm:w-56 text-zinc-900 tab:hidden"
      />

      <HeaderFeatureRow />
    </header>
  );
}
