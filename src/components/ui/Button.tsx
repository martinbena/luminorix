import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  type: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  beforeBackground?: string;
}

export default function Button({
  children,
  href,
  type = "primary",
  onClick,
  ariaLabel,
  disabled,
  beforeBackground,
}: ButtonProps) {
  let buttonStyle =
    "relative uppercase py-3 px-4 min-w-24 min-h-11 tracking-[0.2em] font-serif transition-all duration-[400ms] ease-in-out text-center";

  switch (type) {
    case "primary":
      buttonStyle += ` before:shadow-button bg-zinc-800 text-zinc-200 hover:text-zinc-800 hover:font-medium before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:transition-all before:duration-500 hover:before:w-full ${beforeBackground} ${
        disabled ? "cursor-not-allowed" : ""
      }`;
      break;
    case "secondary":
      buttonStyle += " bg-amber-300 text-zinc-800 hover:bg-amber-400";
      break;
    case "tertiary":
      buttonStyle +=
        " shadow-button bg-transparent text-zinc-800 hover:shadow-button-hover font-medium";
      break;
    default:
      buttonStyle;
      break;
  }

  if (href)
    return (
      <Link href={href} className={buttonStyle} aria-label={ariaLabel}>
        <span className="z-10 relative">{children}</span>
      </Link>
    );

  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={buttonStyle}
    >
      <span className="z-10 relative">{children}</span>
    </button>
  );
}
