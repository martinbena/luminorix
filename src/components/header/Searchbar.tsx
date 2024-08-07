"use client";

import * as actions from "@/actions";
import { useEffect, useRef } from "react";
import { PiMagnifyingGlassThin, PiXThin } from "react-icons/pi";
import ButtonIcon from "../ui/ButtonIcon";
import useKeyboardInteractions from "@/hooks/useKeyboardInteractions";
import useCloseOnClickOutside from "@/hooks/useCloseOnClickOutside";
import Modal from "../ui/Modal";
import { usePathname, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchBarContainerRef = useRef<HTMLDivElement | null>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isVisible]);

  useEffect(() => {
    if (pathname !== "/search" && !searchParams.get("term")) {
      searchFormRef.current?.reset();
    }
  }, [pathname, searchParams]);

  useCloseOnClickOutside(
    isVisible,
    () => onSetVisibility(false),
    searchBarContainerRef
  );

  useKeyboardInteractions(
    isVisible,
    () => onSetVisibility(false),
    searchBarContainerRef,
    "input, button"
  );

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible
          ? "translate-y-[20px] pointer-events-auto"
          : "-translate-y-5 opacity-0 invisible pointer-events-none -z-10 h-0"
      } absolute left-0 -bottom-10 w-full block bg-amber-50 px-12 mob-lg:px-8 mob:px-5 py-2`}
      ref={searchBarContainerRef}
    >
      <div className="flex items-center text-zinc-800 gap-6">
        <PiMagnifyingGlassThin className="h-8 w-8" />
        <form
          ref={searchFormRef}
          className="w-full"
          action={(formData) => {
            actions.search(formData);
            onSetVisibility(false);
          }}
        >
          <input
            ref={searchInputRef}
            name="term"
            type="text"
            className="border-zinc-500 border-opacity-50 focus:outline-none focus:border-opacity-100 border-2 w-full bg-amber-50 text-zinc-800 font-medium placeholder-zinc-800 text-base tracking-[0.2em] px-4 py-2"
            placeholder="Search..."
            defaultValue={searchParams.get("term") || ""}
          />
        </form>

        <ButtonIcon variant="small" onClick={() => onToggleVisibility()}>
          <PiXThin />
        </ButtonIcon>
        <Modal>
          <Modal.Content
            name="overlay"
            isOpenFromOutside={isVisible}
            onCloseOutsideContent={() => onSetVisibility(false)}
            zIndex="z-20"
          />
        </Modal>
      </div>
    </div>
  );
}
