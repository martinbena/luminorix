"use client";

import paths from "@/lib/paths";
import Link from "next/link";
import UserMenuImage from "./UserMenuImage";
import { useSession } from "next-auth/react";
import { PiBellFill, PiCrownSimpleFill, PiPowerBold } from "react-icons/pi";
import Image from "next/image";
import { HiUser } from "react-icons/hi";
import Popover from "../ui/Popover";
import { HiMiniCog6Tooth } from "react-icons/hi2";
import * as actions from "@/actions";

export default function UserMenu() {
  const session = useSession();
  return (
    <>
      <Link href={paths.userMessages()} className="relative" tabIndex={-1}>
        <UserMenuImage screenReaderText="View notifications">
          <PiBellFill className="w-9 h-9 mob:w-7 mob:h-7 text-zinc-600" />
          <span className="absolute -top-1 -right-1 bg-amber-200 text-zinc-800 tracking-normal min-h-5 min-w-5 text-center rounded-full leading-none flex items-center justify-center pointer-events-none py-[2px] px-1 font-sans mob:left-5 mob:-top-1">
            0
          </span>
        </UserMenuImage>
      </Link>

      <Popover>
        <Popover.Button>
          <UserMenuImage screenReaderText="Open menu">
            {session.data?.user.image ? (
              <Image
                src={session.data.user.image}
                alt={`Photo of ${session.data.user.name}`}
                height={64}
                width={64}
                className="rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <HiUser className="w-9 h-9 mob:w-7 mob:h-7 text-zinc-600" />
            )}
          </UserMenuImage>
        </Popover.Button>

        <Popover.Content>
          {session.data?.user.role === "admin" && (
            <Popover.Row
              as={Link}
              href={paths.admin()}
              icon={<PiCrownSimpleFill />}
            >
              Admin
            </Popover.Row>
          )}

          <Popover.Row as={Link} href={paths.userProfile()} icon={<HiUser />}>
            Your Profile
          </Popover.Row>

          <Popover.Row
            as={Link}
            href={paths.userSettings()}
            icon={<HiMiniCog6Tooth />}
          >
            Settings
          </Popover.Row>

          <form action={actions.signOut}>
            <Popover.Row as={"button"} type="submit" icon={<PiPowerBold />}>
              Logout
            </Popover.Row>
          </form>
        </Popover.Content>
      </Popover>
    </>
  );
}
