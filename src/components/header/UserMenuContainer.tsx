"use client";

import paths from "@/lib/paths";
import Link from "next/link";
import UserMenuButton from "./UserMenuButton";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { PiBellFill } from "react-icons/pi";
import Image from "next/image";
import { HiUser } from "react-icons/hi";
import UserMenu from "./UserMenu";

export default function UserMenuContainer() {
  const session = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  return (
    <>
      <Link href={paths.userMessages()} className="relative" tabIndex={-1}>
        <UserMenuButton screenReaderText="View notifications">
          <PiBellFill className="w-9 h-9 mob:w-7 mob:h-7 text-zinc-600" />
          <span className="absolute -top-1 -right-1 bg-amber-200 text-zinc-800 tracking-normal min-h-5 min-w-5 text-center rounded-full leading-none flex items-center justify-center pointer-events-none py-[2px] px-1 font-sans mob:left-5 mob:-top-1">
            0
          </span>
        </UserMenuButton>
      </Link>

      <div className="relative">
        <div>
          <UserMenuButton
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            screenReaderText="Open user menu"
          >
            {session.data?.user.image ? (
              <Image
                src={session.data.user.image}
                alt={`Photo of ${session.data.user.name}`}
                height={64}
                width={64}
                className="rounded-full"
              />
            ) : (
              <HiUser className="w-9 h-9 mob:w-7 mob:h-7 text-zinc-600" />
            )}
          </UserMenuButton>
        </div>
        {isProfileMenuOpen && (
          <UserMenu
            isOpen={isProfileMenuOpen}
            setIsOpen={setIsProfileMenuOpen}
          />
        )}
      </div>
    </>
  );
}
