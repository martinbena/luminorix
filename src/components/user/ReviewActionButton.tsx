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
      className="group flex items-center gap-2 font-sans uppercase text-xs font-bold border-b border-zinc-300 flex-grow px-3 hover:bg-amber-50 transition-colors [&>*:nth-child(1)]:h-5 [&>*:nth-child(1)]:w-5 [&>*:nth-child(1)]:text-zinc-600 [&>*:nth-child(1)]:group-hover:text-amber-700 [&>*:nth-child(1)]:transition-colors "
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
