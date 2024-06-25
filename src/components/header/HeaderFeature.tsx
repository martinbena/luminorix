import Link from "next/link";
import { ReactNode } from "react";

interface HeaderFeatureProps {
  link?: string;
  children: ReactNode;
  onClick?: () => void;
  count?: number;
}

export default function HeaderFeature({
  link,
  children,
  onClick,
  count,
}: HeaderFeatureProps) {
  const baseClasses =
    "font-medium text-base hover-child:text-amber-200 [&>*:nth-child(1)]:h-16 [&>*:nth-child(1)]:w-16 tab-xl:[&>*:nth-child(1)]:h-12 tab-xl:[&>*:nth-child(1)]:w-12 mob:[&>*:nth-child(1)]:w-9 mob:[&>*:nth-child(1)]:h-9 flex items-center gap-3 tab-xl:[&>*:nth-child(2)]:hidden focus:outline-none focus-child:text-amber-200";
  return (
    <div className="relative">
      {link && (
        <>
          <Link href={link} className={baseClasses}>
            {children}
          </Link>
          <span className="absolute top-0.5 left-12 bg-amber-200 tab-xl:left-8 tab-xl:top-0 text-zinc-800 tracking-normal min-h-5 min-w-5 text-center rounded-full aspect-square leading-none flex items-center justify-center pointer-events-none py-[2px] px-1 font-sans font-medium mob:left-5 mob:-top-1">
            {count || 0}
          </span>
        </>
      )}
      {!link && (
        <button onClick={onClick} className={`${baseClasses} tracking-[0.2em]`}>
          {children}
        </button>
      )}
    </div>
  );
}
