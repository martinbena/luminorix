import { ReactNode } from "react";

interface ReviewActionButtonProps {
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => {};
}

export default function ReviewActionButton({
  icon,
  children,
  onClick,
}: ReviewActionButtonProps) {
  function handleClick() {
    if (onClick) onClick();
  }
  return (
    <button
      onClick={onClick ? handleClick : undefined}
      className="flex items-center gap-2 font-sans uppercase text-xs font-bold [&:not(:last-child)]:border-b border-amber-500 flex-grow px-3 hover:bg-amber-50 transition-colors [&>*:nth-child(1)]:h-5 [&>*:nth-child(1)]:w-5 [&>*:nth-child(1)]:text-zinc-600 [&>*:nth-child(1)]:hover:text-amber-700 [&>*:nth-child(1)]:transition-colors focus:outline-none focus:bg-amber-50"
    >
      {icon}
      <span className="mob:hidden">{children}</span>
    </button>
  );
}
