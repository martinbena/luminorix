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
      <span className="absolute top-0.5 left-12 bg-amber-200 text-zinc-800 tracking-normal min-h-5 min-w-5 text-center rounded-full leading-none flex items-center justify-center pointer-events-none py-[2px] px-1 font-sans">
        0
      </span>
    </div>
  );
}
