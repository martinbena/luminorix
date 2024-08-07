"use client";

import * as actions from "@/actions";
import paths from "@/lib/paths";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { HiUser } from "react-icons/hi";
import {
  PiBellFill,
  PiCrownSimpleFill,
  PiPackageFill,
  PiPowerBold,
} from "react-icons/pi";
import Popover from "../ui/Popover";
import UserMenuImage from "./UserMenuImage";
import { useEffect } from "react";
import { useMessagesContext } from "@/app/contexts/MessagesContext";

export default function UserMenu() {
  const session = useSession();
  const { unreadMessagesCount, setUnreadMessagesCount } = useMessagesContext();

  useEffect(() => {
    async function fetchUnreadMessages() {
      if (!session.data?.user) return;
      try {
        const res = await fetch("/api/messages");

        if (res.status === 200) {
          const data = await res.json();
          setUnreadMessagesCount(data);
        }
      } catch (error) {
        console.log(error);
        setUnreadMessagesCount(0);
      }
    }

    fetchUnreadMessages();
  }, [session, setUnreadMessagesCount]);

  return (
    <>
      <Link href={paths.userMessages()} className="relative" tabIndex={-1}>
        <UserMenuImage screenReaderText="View messages">
          <PiBellFill className="w-9 h-9 mob:w-7 mob:h-7 text-zinc-600" />
          <span className="absolute font-medium -top-1 -right-1 bg-amber-200 text-zinc-800 tracking-normal min-h-5 min-w-5 text-center rounded-full leading-none flex items-center justify-center pointer-events-none py-0.5 px-1 font-sans mob:left-5 mob:-top-1">
            {unreadMessagesCount}
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
            Profile
          </Popover.Row>

          <Popover.Row
            as={Link}
            href={paths.userOrderShowAll()}
            icon={<PiPackageFill />}
          >
            Orders
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
