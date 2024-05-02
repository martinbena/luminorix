"use client";

import paths from "@/lib/paths";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserLoadingSkeleton from "./UserLoading";
import UserMenu from "./UserMenu";

export default function HeaderAuth() {
  const session = useSession();

  return (
    <div className="flex gap-10 tab-xl:gap-14 tab:gap-6 mob:gap-8 mob-sm:gap-3 justify-self-end place-items-center">
      {session.status === "loading" ? (
        <UserLoadingSkeleton />
      ) : session.data?.user ? (
        <UserMenu />
      ) : (
        <>
          <Link
            href={paths.register()}
            className="hover:text-amber-200 focus:text-amber-200"
          >
            Register
          </Link>
          <Link
            href={paths.login()}
            className="hover:text-amber-200 focus:text-amber-200"
          >
            Login
          </Link>
        </>
      )}
    </div>
  );
}
