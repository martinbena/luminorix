"use client";

import { useMergedSearchParams } from "@/lib/helpers";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface NavigationLinkProps {
  href: string;
  description: string;
  activeClasses?: string;
}

export default function NavigationLink({
  href,
  description,
  activeClasses = "bg-amber-200",
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
    <li className="child:flex child:flex-1 child:py-2.5 child:pl-12">
      <Link
        className={`${isActive ? `${activeClasses}` : ""}`}
        href={
          href.split("?").some((param) => searchParams.includes(param))
            ? mergedLink
            : href
        }
      >
        {description}
      </Link>
    </li>
  );
}
