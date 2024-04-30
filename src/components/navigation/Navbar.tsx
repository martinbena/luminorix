import { ReactNode } from "react";

interface NavbarProps {
  children: ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  return <div className="bg-zinc-50 overflow-hidden">{children}</div>;
}
