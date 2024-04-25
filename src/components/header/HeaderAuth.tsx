"use client";

import paths from "@/lib/paths";
import Link from "next/link";
import * as actions from "@/actions";
import { useSession } from "next-auth/react";
import { SkeletonAvatar } from "skeleton-elements/react";

export default function HeaderAuth() {
  const session = useSession();

  return (
    <div className="flex gap-20 tab-xl:gap-16 tab:gap-8 mob:gap-3 justify-self-end">
      {session.status === "loading" ? (
        <>
          <div className="rounded-full flex justify-center items-center p-0.5 bg-amber-200">
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
          <div className="rounded-full flex justify-center items-center p-0.5 bg-amber-200">
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
        <form action={actions.signOut}>
          <button type="submit">Sign Out</button>
        </form>
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
