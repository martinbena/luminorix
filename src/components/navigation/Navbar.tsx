import { ReactNode } from "react";

interface NavbarProps {
  children: ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  return <div className="bg-amber-100 overflow-hidden">{children}</div>;
}
