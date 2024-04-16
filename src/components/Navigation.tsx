"use client";

import paths from "@/paths";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PiListThin, PiXThin } from "react-icons/pi";
import Overlay from "./Overlay";

export default function Navigation() {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState<boolean>(false);
  const mobileNavContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isMobileNavVisible) {
      const handleTabKey = (e: KeyboardEvent): void => {
        const focusableElements =
          mobileNavContainerRef.current?.querySelectorAll("a, button");

        if (!focusableElements) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (
          e.key === "Tab" &&
          e.shiftKey &&
          document.activeElement === firstElement
        ) {
          e.preventDefault();
          (lastElement as HTMLElement).focus();
        }

        if (
          e.key === "Tab" &&
          !e.shiftKey &&
          document.activeElement === lastElement
        ) {
          e.preventDefault();
          (firstElement as HTMLElement).focus();
        }
      };

      const handleEscapeKey = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
          setIsMobileNavVisible(false);
          document.body.style.overflow = "auto";
        }
      };

      document.addEventListener("keydown", handleTabKey);
      document.addEventListener("keydown", handleEscapeKey);

      return () => {
        document.removeEventListener("keydown", handleTabKey);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [isMobileNavVisible]);

  function toggleMobileNavVisibility(): void {
    setIsMobileNavVisible((visible) => !visible);

    document.body.style.overflow = isMobileNavVisible ? "auto" : "hidden";
  }

  return (
    <>
      <div className="hidden tab:block bg-amber-100 px-12 py-2 tab:px-8 mob:px-5">
        <button onClick={() => toggleMobileNavVisibility()}>
          <PiListThin className="h-12 w-12 fill-zinc-800" />
        </button>
        <Overlay
          isOpen={isMobileNavVisible}
          onClose={() => toggleMobileNavVisibility()}
          zIndex="z-40"
        />
      </div>
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
          <button onClick={() => toggleMobileNavVisibility()}>
            <PiXThin className="h-6 w-6" />
          </button>
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
