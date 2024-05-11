import { ReactNode } from "react";

interface ButtonIconProps {
  variant: string;
  additionalClasses?: string;
  onClick: React.Dispatch<React.SetStateAction<any>>;
  children: ReactNode;
  tabIndex?: number;
}

export default function ButtonIcon({
  variant,
  additionalClasses,
  onClick,
  children,
  tabIndex = 0,
}: ButtonIconProps) {
  return (
    <button
      className={`${
        variant === "small"
          ? "child:h-8 child:w-8"
          : variant === "large"
          ? "child:h-12 child:w-12"
          : ""
      } ${additionalClasses ?? ""}`}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  );
}
