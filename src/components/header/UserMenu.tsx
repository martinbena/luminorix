"use client";

import paths from "@/lib/paths";
import Link from "next/link";
import { HiUser } from "react-icons/hi";
import { HiMiniCog6Tooth } from "react-icons/hi2";
import { PiCrownSimpleFill, PiPowerBold } from "react-icons/pi";
import * as actions from "@/actions";
import UserMenuItem from "./UserMenuItem";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import useCloseOnClickOutside from "@/hooks/useCloseOnClickOutside";

interface UserMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function UserMenu({ isOpen, setIsOpen }: UserMenuProps) {
  const session = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useCloseOnClickOutside(isOpen, setIsOpen, userMenuRef);

  return (
    <div
      className="absolute font-sans flex flex-col gap-2.5 right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-zinc-50 py-2 ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      ref={userMenuRef}
    >
      {session.data?.user.role === "admin" && (
        <UserMenuItem
          as={Link}
          href={paths.admin()}
          onClick={() => setIsOpen(false)}
        >
          <PiCrownSimpleFill />
          <span>Admin</span>
        </UserMenuItem>
      )}
      <UserMenuItem
        as={Link}
        href={paths.userProfile()}
        onClick={() => setIsOpen(false)}
      >
        <HiUser />
        <span>Your Profile</span>
      </UserMenuItem>
      <UserMenuItem
        as={Link}
        href={paths.userSettings()}
        onClick={() => setIsOpen(false)}
      >
        <HiMiniCog6Tooth />
        <span>Settings</span>
      </UserMenuItem>
      <form action={actions.signOut}>
        <UserMenuItem as={"button"} type="submit">
          <PiPowerBold />
          <span>Logout</span>
        </UserMenuItem>
      </form>
      <div className="triangle" />
    </div>
  );
}
