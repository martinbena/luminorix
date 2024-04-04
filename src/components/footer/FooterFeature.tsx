import { ReactNode } from "react";

interface FooterFeatureProps {
  title: string;
  children: ReactNode;
  icon: ReactNode;
}

export default function FooterFeature({
  title,
  icon,
  children,
}: FooterFeatureProps) {
  return (
    <div className="flex items-center gap-4 [&>*:nth-child(1)]:h-12 [&>*:nth-child(1)]:w-12 [&>*:nth-child(1)]:text-amber-200">
      {icon}
      <div>
        <p className="uppercase tracking-widest font-semibold text-base">
          {title}
        </p>
        <p className="font-sans font-medium">{children}</p>
      </div>
    </div>
  );
}
