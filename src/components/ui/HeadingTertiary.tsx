import { ReactNode } from "react";

interface HeadingTertiaryProps {
  children: ReactNode;
}

export default function HeadingTertiary({ children }: HeadingTertiaryProps) {
  return (
    <h3 className="uppercase font-medium tracking-[0.2em] font-serif">
      {children}
    </h3>
  );
}
