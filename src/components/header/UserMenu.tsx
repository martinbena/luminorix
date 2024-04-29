"use client";

import paths from "@/lib/paths";
import Link from "next/link";
import { HiUser } from "react-icons/hi";
import { HiMiniCog6Tooth } from "react-icons/hi2";
import { PiPowerBold } from "react-icons/pi";
import * as actions from "@/actions";
import UserMenuItem from "./UserMenuItem";
import { useEffect, useRef } from "react";

interface UserMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function UserMenu({ isOpen, setIsOpen }: UserMenuProps) {
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        isOpen &&
        userMenuRef.current &&
        !userMenuRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
        document.body.style.overflow = "auto";
      }
    }

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isOpen, setIsOpen]);

  return (
    <div
      className="absolute font-sans flex flex-col gap-2.5 right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-zinc-50 py-2 ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      ref={userMenuRef}
    >
      <UserMenuItem
        as={Link}
        href={paths.userProfile()}
        onClick={() => setIsOpen(false)}
      >
        <HiUser />
        Your Profile
      </UserMenuItem>
      <UserMenuItem
        as={Link}
        href={paths.userSettings()}
        onClick={() => setIsOpen(false)}
      >
        <HiMiniCog6Tooth />
        Settings
      </UserMenuItem>
      <form action={actions.signOut}>
        <UserMenuItem as={"button"} type="submit">
          <PiPowerBold />
          Logout
        </UserMenuItem>
      </form>
      <div className="triangle" />
    </div>
  );
}
