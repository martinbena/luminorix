"use client";

import { useMergedSearchParams } from "@/lib/helpers";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactElement } from "react";

interface NavigationLinkProps {
  href: string;
  description: string;
  activeClasses?: string;
  icon?: ReactElement;
}

export default function NavigationLink({
  href,
  description,
  activeClasses = "bg-amber-200",
  icon,
}: NavigationLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  const mergedLink = useMergedSearchParams(href);

  const isActive =
    (pathname === href &&
      ((href === "/products" &&
        !href.split("?").some(() => searchParams.includes("category"))) ||
        !searchParams.length ||
        href.split("/").length > 2)) ||
    (pathname.includes(`${href}/`) && href.split("/").length > 2) ||
    (searchParams.length &&
      (href.includes(searchParams) ||
        href.split("?").some((param) => searchParams.includes(param))));

  return (
    <li>
      <Link
        className={`${isActive ? `${activeClasses}` : ""} flex flex-1 py-2.5 ${
          icon
            ? "gap-4 pl-8 items-center [&>*:nth-child(1)]:h-6 [&>*:nth-child(1)]:w-6 [&>*:nth-child(1)]:text-zinc-800"
            : "pl-12"
        } focus:outline-none ${
          activeClasses === "bg-amber-200"
            ? "focus:bg-amber-200"
            : "focus:bg-zinc-800 focus:text-amber-200"
        }`}
        href={
          href.split("?").some((param) => searchParams.includes(param)) ||
          (!href.includes("?") && !searchParams.includes("category"))
            ? mergedLink
            : href
        }
      >
        {icon && icon}
        {description}
      </Link>
    </li>
  );
}
