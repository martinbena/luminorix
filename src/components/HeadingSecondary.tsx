import { ReactNode } from "react";

interface HeadingSecondaryProps {
  children: ReactNode;
}

export default function HeadingSecondary({ children }: HeadingSecondaryProps) {
  return (
    <h2 className="uppercase tracking-[0.2em] font-serif text-xl">
      {children}
    </h2>
  );
}
