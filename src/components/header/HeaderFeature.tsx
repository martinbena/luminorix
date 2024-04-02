import Link from "next/link";
import { ReactNode } from "react";

interface HeaderFeatureProps {
  link: string;
  children: ReactNode;
}

export default function HeaderFeature({ link, children }: HeaderFeatureProps) {
  return (
    <div className="relative">
      <Link
        href={link}
        className="flex items-center gap-3 font-medium text-base hover-child:text-amber-200"
      >
        {children}
      </Link>
      <span className="absolute top-0.5 left-12 whitespace-nowrap align-middle text-sm leading-none inline-block min-h-5 min-w-5 text-zinc-800 py-[2px] px-[4px] bg-amber-200 rounded-full text-center pointer-events-none">
        0
      </span>
    </div>
  );
}
