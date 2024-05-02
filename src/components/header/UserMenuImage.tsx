import { ReactNode } from "react";

interface UserMenuImageProps {
  children: ReactNode;
  screenReaderText: string;
}

export default function UserMenuImage({
  children,
  screenReaderText,
}: UserMenuImageProps) {
  return (
    <div
      className="relative flex rounded-full justify-center items-center p-0.5 bg-zinc-50 hover:bg-amber-200 hover-child:text-zinc-800 focus:text-zinc-800 focus:bg-amber-200 transition-colors duration-300 ease-out h-14 w-14 mob:w-9 mob:h-9"
      tabIndex={0}
      role="image"
    >
      <span className="sr-only">{screenReaderText}</span>
      {children}
    </div>
  );
}
