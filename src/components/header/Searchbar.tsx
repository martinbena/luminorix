"use client";

import { useEffect, useRef } from "react";
import { PiMagnifyingGlassThin, PiXThin } from "react-icons/pi";
import Overlay from "../Overlay";
import ButtonIcon from "../ButtonIcon";
import useKeyboardInteractions from "@/hooks/useKeyboardInteractions";

interface SearchbarProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  onSetVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Searchbar({
  isVisible,
  onToggleVisibility,
  onSetVisibility,
}: SearchbarProps) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchBarContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        isVisible &&
        searchInputRef.current &&
        !searchBarContainerRef.current?.contains(e.target as Node)
      ) {
        onSetVisibility(false);
        document.body.style.overflow = "auto";
      }
    }

    if (isVisible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isVisible, onSetVisibility]);

  useKeyboardInteractions(
    isVisible,
    onSetVisibility,
    searchBarContainerRef,
    "input, button"
  );

  return (
    <div
      className={`${
        isVisible
          ? "translate-y-[20px] pointer-events-auto transition-all duration-300 ease-out"
          : "-translate-y-5 opacity-0 invisible pointer-events-none -z-10 h-0"
      } absolute left-0 -bottom-10 w-full block bg-amber-50 px-12 mob-lg:px-8 mob:px-5 py-2`}
      ref={searchBarContainerRef}
    >
      <div className="flex items-center text-zinc-800 gap-6">
        <PiMagnifyingGlassThin className="h-8 w-8" />
        <input
          ref={searchInputRef}
          type="text"
          className="border-zinc-500 border-opacity-50 focus:outline-none focus:border-opacity-100 border-2 w-full bg-amber-50 text-zinc-800 placeholder-zinc-800 text-base tracking-[0.2em] px-4 py-2"
          placeholder="Search..."
        />

        <ButtonIcon variant="small" onClick={() => onToggleVisibility()}>
          <PiXThin />
        </ButtonIcon>

        <Overlay isOpen={isVisible} zIndex="z-20" />
      </div>
    </div>
  );
}
