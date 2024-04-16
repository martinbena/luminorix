"use client";

import { useState } from "react";
import ButtonIcon from "../ButtonIcon";
import { PiListThin } from "react-icons/pi";
import Overlay from "../Overlay";
import MobileNavigation from "./MobileNavigation";

export default function MobileControlPanel() {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState<boolean>(false);

  function toggleMobileNavVisibility(): void {
    setIsMobileNavVisible((visible) => !visible);

    document.body.style.overflow = isMobileNavVisible ? "auto" : "hidden";
  }
  return (
    <>
      <section className="hidden tab:block bg-amber-100 px-12 py-2 tab:px-8 mob:px-5">
        <ButtonIcon
          variant="large"
          onClick={() => toggleMobileNavVisibility()}
          additionalClasses="child:fill-zinc-800"
        >
          <PiListThin />
        </ButtonIcon>
        <Overlay
          isOpen={isMobileNavVisible}
          onClose={() => toggleMobileNavVisibility()}
          zIndex="z-40"
        />
      </section>

      <MobileNavigation
        isVisible={isMobileNavVisible}
        onToggleVisibility={toggleMobileNavVisibility}
        onSetVisibility={setIsMobileNavVisible}
      />
    </>
  );
}
