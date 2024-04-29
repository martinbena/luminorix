"use client";

import paths from "@/lib/paths";
import Link from "next/link";
import * as actions from "@/actions";
import { useSession } from "next-auth/react";
import { SkeletonAvatar } from "skeleton-elements/react";
import { PiBellFill } from "react-icons/pi";
import { HiUser } from "react-icons/hi";
import Image from "next/image";
import UserMenuButton from "./UserMenuButton";

export default function HeaderAuth() {
  const session = useSession();

  return (
    <div className="flex gap-10 tab-xl:gap-14 tab:gap-6 mob:gap-8 mob-sm:gap-3 justify-self-end place-items-center">
      {session.status === "loading" ? (
        <>
          <div className="rounded-full flex justify-center items-center p-0.5 bg-amber-200 mob:w-9 mob:h-9">
            <SkeletonAvatar
              size={48}
              color="#d4d4d4"
              iconColor="#27272A"
              effect="wave"
              tag="span"
              showIcon={false}
              borderRadius="50%"
            />
          </div>
          <div className="rounded-full flex justify-center items-center p-0.5 bg-amber-200 mob:w-9 mob:h-9">
            <SkeletonAvatar
              size={48}
              color="#d4d4d4"
              iconColor="#27272A"
              effect="wave"
              tag="span"
              showIcon={true}
              borderRadius="50%"
            />
          </div>
        </>
      ) : session.data?.user ? (
        // <form action={actions.signOut}>
        //   <button type="submit">Sign Out</button>
        // </form>
        <>
          <Link href={paths.userMessages()} className="relative">
            <UserMenuButton screenReaderText="View notifications">
              <PiBellFill className="w-9 h-9 mob:w-7 mob:h-7 text-zinc-600" />
              <span className="absolute -top-1 -right-1 bg-amber-200 text-zinc-800 tracking-normal min-h-5 min-w-5 text-center rounded-full leading-none flex items-center justify-center pointer-events-none py-[2px] px-1 font-sans mob:left-5 mob:-top-1">
                0
              </span>
            </UserMenuButton>
          </Link>

          <div>
            <div>
              <UserMenuButton screenReaderText="Open user menu">
                {session.data.user.image ? (
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
          </div>
        </>
      ) : (
        <>
          <Link href={paths.register()} className="hover:text-amber-200">
            Register
          </Link>
          <Link href={paths.login()} className="hover:text-amber-200">
            Login
          </Link>
        </>
      )}
    </div>
  );
}
