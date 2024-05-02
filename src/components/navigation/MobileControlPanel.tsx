"use client";

import { useRef, useState } from "react";
import ButtonIcon from "../ButtonIcon";
import { PiCrownSimpleLight, PiListThin, PiUserListThin } from "react-icons/pi";
import Overlay from "../Overlay";
import MobileNavigation from "./MobileNavigation";
import Navigation, { NavigationProps } from "./Navigation";

interface MobileControlPanelProps {
  mode?: "user" | "admin";
}

export default function MobileControlPanel({ mode }: MobileControlPanelProps) {
  const [activeNav, setActiveNav] = useState<NavigationProps["mode"] | null>(
    null
  );
  const panelRef = useRef<HTMLElement>(null);

  function toggleVisibility(nav: NavigationProps["mode"]): void {
    setActiveNav((prevNav) => (prevNav === nav ? null : nav));
    document.body.style.overflow = activeNav === nav ? "auto" : "hidden";
  }

  function closeVisibleNavigation(): void {
    setActiveNav(null);
    document.body.style.overflow = "auto";
  }

  return (
    <>
      <section
        ref={panelRef}
        className="hidden tab:flex gap-8 justify-between bg-amber-100 px-12 py-2 tab:px-8 mob:px-5"
      >
        <div className="flex gap-8">
          <ButtonIcon
            variant="large"
            onClick={() => toggleVisibility("shop")}
            additionalClasses="child:fill-zinc-800"
            tabIndex={activeNav ? -1 : 0}
          >
            <PiListThin />
          </ButtonIcon>
          {(mode === "user" || mode === "admin") && (
            <ButtonIcon
              variant="large"
              onClick={() => toggleVisibility("user")}
              additionalClasses="child:fill-zinc-800"
              tabIndex={activeNav ? -1 : 0}
            >
              <PiUserListThin />
            </ButtonIcon>
          )}
        </div>

        {mode === "admin" && (
          <div>
            <ButtonIcon
              variant="large"
              onClick={() => toggleVisibility("admin")}
              additionalClasses="child:fill-zinc-800"
              tabIndex={activeNav ? -1 : 0}
            >
              <PiCrownSimpleLight />
            </ButtonIcon>
          </div>
        )}

        <Overlay
          isOpen={activeNav !== null}
          onClose={() => closeVisibleNavigation()}
          zIndex="z-40"
        />
      </section>

      <MobileNavigation
        isVisible={activeNav !== null}
        onToggleVisibility={() => activeNav && toggleVisibility(activeNav)}
        onSetVisibility={(isVisible) =>
          isVisible ? setActiveNav(activeNav) : setActiveNav(null)
        }
      >
        {activeNav ? <Navigation mode={activeNav} /> : null}
      </MobileNavigation>
    </>
  );
}
