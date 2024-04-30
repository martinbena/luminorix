import { ReactNode } from "react";

interface UserMenuButtonProps {
  children: ReactNode;
  screenReaderText: string;
  onClick?: () => void;
}

export default function UserMenuButton({
  children,
  screenReaderText,
  onClick,
}: UserMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex rounded-full justify-center items-center p-0.5 bg-zinc-50 hover:bg-amber-200 hover-child:text-zinc-800 focus:text-zinc-800 focus:bg-amber-200 transition-colors duration-300 ease-out h-14 w-14 mob:w-9 mob:h-9"
    >
      <span className="sr-only">{screenReaderText}</span>
      {children}
    </button>
  );
}
