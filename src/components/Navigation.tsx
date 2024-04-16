"use client";

import paths from "@/paths";
import Link from "next/link";
import { useRef, useState } from "react";
import { PiListThin, PiXThin } from "react-icons/pi";
import Overlay from "./Overlay";
import ButtonIcon from "./ButtonIcon";
import useKeyboardInteractions from "@/hooks/useKeyboardInteractions";

export default function Navigation() {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState<boolean>(false);
  const mobileNavContainerRef = useRef<HTMLDivElement | null>(null);

  useKeyboardInteractions(
    isMobileNavVisible,
    setIsMobileNavVisible,
    mobileNavContainerRef
  );

  function toggleMobileNavVisibility(): void {
    setIsMobileNavVisible((visible) => !visible);

    document.body.style.overflow = isMobileNavVisible ? "auto" : "hidden";
  }

  return (
    <>
      <section className="hidden tab:block bg-amber-100 px-12 py-2 tab:px-8 mob:px-5">
        <ButtonIcon
          variant="large"
          onClick={() => toggleMobileNavVisibility()}
          additionalClasses="child:fill-zinc-800"
        >
          <PiListThin />
        </ButtonIcon>
        <Overlay
          isOpen={isMobileNavVisible}
          onClose={() => toggleMobileNavVisibility()}
          zIndex="z-40"
        />
      </section>
      <section
        className={`hidden h-screen tab:block fixed transition-all duration-500 z-50 ease-out top-0 left-0 p-8 w-80 bg-white ${
          isMobileNavVisible
            ? ""
            : "pointer-events-none invisible -translate-x-full"
        } `}
      >
        <div
          className={`transition-all duration-500 delay-[250ms] ease-out ${
            isMobileNavVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-16 opacity-0"
          }`}
          ref={mobileNavContainerRef}
        >
          <ButtonIcon
            variant="small"
            onClick={() => toggleMobileNavVisibility()}
          >
            <PiXThin />
          </ButtonIcon>
          <nav className="tracking-[0.2em] text-zinc-800 bg-white uppercase mt-5 child:py-6 child:flex child:flex-col child:gap-2">
            <ul className="bg-amber-200 child-hover:bg-zinc-800 child:px-8 child-hover:text-amber-200 child:py-2.5">
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
            <ul className="child:py-2.5 child-hover:bg-zinc-800 child:px-8 child-hover:text-amber-200 bg-zinc-50">
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
        </div>
      </section>
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
