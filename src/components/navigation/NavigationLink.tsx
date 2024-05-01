"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const isActive = pathname === href;
  return (
    <li className="child:flex child:flex-1 child:py-2.5 child:pl-12">
      <Link className={`${isActive ? `${activeClasses}` : ""}`} href={href}>
        {description}
      </Link>
    </li>
  );
}
