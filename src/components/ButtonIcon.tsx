import { ReactNode } from "react";

interface ButtonIconProps {
  variant: string;
  additionalClasses?: string;
  onClick: () => void;
  children: ReactNode;
}

export default function ButtonIcon({
  variant,
  additionalClasses,
  onClick,
  children,
}: ButtonIconProps) {
  return (
    <button
      className={`${
        variant === "small"
          ? "child:h-8 child:w-8"
          : variant === "large"
          ? "child:h-12 child:w-12"
          : ""
      } ${additionalClasses}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
