"use client";

import { useState } from "react";
import ButtonIcon from "../ButtonIcon";
import { PiCrownSimpleLight, PiListThin, PiUserListThin } from "react-icons/pi";
import Overlay from "../Overlay";
import MobileNavigation from "./MobileNavigation";

interface MobileControlPanel {
  mode?: "user" | "admin";
}

export default function MobileControlPanel({ mode }: MobileControlPanel) {
  const [activeNav, setActiveNav] = useState<string | null>(null);

  function toggleVisibility(nav: string): void {
    setActiveNav((prevNav) => (prevNav === nav ? null : nav));
    document.body.style.overflow = activeNav === nav ? "auto" : "hidden";
  }

  function closeVisibleNavigation(): void {
    setActiveNav(null);
    document.body.style.overflow = "auto";
  }

  return (
    <>
      <section className="hidden tab:flex gap-8 justify-between bg-amber-100 px-12 py-2 tab:px-8 mob:px-5">
        <div className="flex gap-8">
          <ButtonIcon
            variant="large"
            onClick={() => toggleVisibility("mobile")}
            additionalClasses="child:fill-zinc-800"
          >
            <PiListThin />
          </ButtonIcon>
          {(mode === "user" || mode === "admin") && (
            <ButtonIcon
              variant="large"
              onClick={() => toggleVisibility("user")}
              additionalClasses="child:fill-zinc-800"
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
        isVisible={activeNav === "mobile"}
        onToggleVisibility={() => toggleVisibility("mobile")}
        onSetVisibility={(isVisible) =>
          isVisible ? setActiveNav("mobile") : setActiveNav(null)
        }
        mode="shop"
      />

      {(mode === "user" || mode === "admin") && (
        <MobileNavigation
          isVisible={activeNav === "user"}
          onToggleVisibility={() => toggleVisibility("user")}
          onSetVisibility={(isVisible) =>
            isVisible ? setActiveNav("user") : setActiveNav(null)
          }
          mode="user"
        />
      )}

      {mode === "admin" && (
        <MobileNavigation
          isVisible={activeNav === "admin"}
          onToggleVisibility={() => toggleVisibility("admin")}
          onSetVisibility={(isVisible) =>
            isVisible ? setActiveNav("admin") : setActiveNav(null)
          }
          mode="admin"
        />
      )}
    </>
  );
}
