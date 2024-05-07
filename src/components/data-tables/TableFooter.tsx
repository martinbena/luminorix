import { ReactNode } from "react";

interface FooterProps {
  children: ReactNode;
}

export default function Footer({ children }: FooterProps) {
  return (
    <footer className="p-3 bg-zinc-100 flex justify-center [&:not(:has(*))]:hidden">
      {children}
    </footer>
  );
}
