import paths from "@/paths";
import Image from "next/image";
import Link from "next/link";
import { PiHeartThin } from "react-icons/pi";
import { PiShoppingCartSimpleThin } from "react-icons/pi";
import HeaderFeature from "./HeaderFeature";

export default function Header() {
  return (
    <header className="bg-zinc-800 text-zinc-50 tracking-[0.2em] p-12 grid grid-cols-3 justify-items-center gap-y-20 items-center">
      <span>&nbsp;</span>

      <div>
        <Link href={paths.home()}>
          <Image
            src="/images/logo.png"
            width={128}
            height={128}
            alt="Logo of Luminorix"
          />
        </Link>
      </div>

      <div className="flex gap-20">
        <Link href={paths.register()} className="hover:text-amber-200">
          Register
        </Link>
        <Link href={paths.login()} className="hover:text-amber-200">
          Login
        </Link>
      </div>

      <Link
        href={paths.home()}
        className="uppercase text-5xl tracking-[0.25em] text-zinc-200 justify-self-start"
      >
        Luminorix
      </Link>

      <input
        type="text"
        placeholder="Search..."
        className="py-4 px-5 tracking-[0.2em] text-zinc-900"
      />

      <div className="flex gap-16">
        <HeaderFeature link={paths.userWishlist()}>
          <PiHeartThin className="h-16 w-16" /> <span>Wishlist</span>
        </HeaderFeature>

        <HeaderFeature link={paths.cart()}>
          <PiShoppingCartSimpleThin className="h-16 w-16" />{" "}
          <div>
            <p className="text-base">Cart</p>{" "}
            <span className="font-sans font-semibold tracking-wider">
              is empty
            </span>
          </div>
        </HeaderFeature>
      </div>
    </header>
  );
}
