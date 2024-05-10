"use client";

import { PiXThin } from "react-icons/pi";
import ButtonIcon from "../ui/ButtonIcon";
import { ReactNode, useRef } from "react";
import useKeyboardInteractions from "@/hooks/useKeyboardInteractions";
import useClickInteraction from "@/hooks/useClickInteraction";

interface MobileNavigationProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  onSetVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

export default function MobileNavigation({
  isVisible,
  onToggleVisibility,
  onSetVisibility,
  children,
}: MobileNavigationProps) {
  const mobileNavContainerRef = useRef<HTMLDivElement | null>(null);

  useKeyboardInteractions(
    isVisible,
    () => onSetVisibility(false),
    mobileNavContainerRef
  );
  useClickInteraction(isVisible, onSetVisibility, mobileNavContainerRef);

  return (
    <section
      className={`hidden h-screen tab:block fixed z-50 transition-all duration-500 ease-out top-0 left-0 p-8 w-80 bg-white ${
        isVisible
          ? "translate-x-0 visible pointer-events-auto "
          : "pointer-events-none invisible -translate-x-full"
      } `}
    >
      <div
        className={`transition-[opacity,_transform] duration-500 delay-[250ms] ease-out ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
        }`}
        ref={mobileNavContainerRef}
      >
        <header className="mb-5">
          <ButtonIcon variant="small" onClick={() => onToggleVisibility()}>
            <PiXThin />
          </ButtonIcon>
        </header>
        {children}
      </div>
    </section>
  );
}
