"use client";

import { useState } from "react";
import ButtonIcon from "../ui/ButtonIcon";
import {
  PiCrownSimpleLight,
  PiListThin,
  PiSlidersThin,
  PiUserListThin,
} from "react-icons/pi";
import MobileNavigation from "./MobileNavigation";
import Navigation, { NavigationProps } from "./Navigation";
import Modal from "../ui/Modal";
import FilterPanel from "../ui/FilterPanel";

interface MobileControlPanelProps {
  mode?: "shop" | "user" | "admin";
}

type ActiveNavType = NavigationProps["mode"] | "filters";

export default function MobileControlPanel({ mode }: MobileControlPanelProps) {
  const [activeNav, setActiveNav] = useState<ActiveNavType | null>(null);

  function toggleVisibility(nav: NavigationProps["mode"] | "filters"): void {
    setActiveNav((prevNav) => (prevNav === nav ? null : nav));
  }

  function closeVisibleNavigation(): void {
    setActiveNav(null);
  }

  return (
    <>
      <section className="hidden tab:flex gap-8 justify-between bg-amber-100 px-12 py-2 tab:px-8 mob:px-5">
        <div className="flex gap-8">
          <ButtonIcon
            variant="large"
            onClick={() => toggleVisibility("shop")}
            additionalClasses="child:fill-zinc-800"
            tabIndex={activeNav ? -1 : 0}
          >
            <PiListThin />
          </ButtonIcon>

          {mode === "shop" && (
            <ButtonIcon
              variant="large"
              onClick={() => toggleVisibility("filters")}
              additionalClasses="child:fill-zinc-800"
              tabIndex={activeNav ? -1 : 0}
            >
              <PiSlidersThin />
            </ButtonIcon>
          )}

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

        <Modal>
          <Modal.Content
            name="overlay"
            isOpenFromOutside={activeNav !== null}
            onCloseOutsideContent={() => closeVisibleNavigation()}
          />
        </Modal>
      </section>

      <MobileNavigation
        isVisible={activeNav !== null}
        onToggleVisibility={() => activeNav && toggleVisibility(activeNav)}
        onSetVisibility={(isVisible) =>
          isVisible ? setActiveNav(activeNav) : setActiveNav(null)
        }
      >
        {activeNav === "filters" ? (
          <FilterPanel />
        ) : activeNav ? (
          <Navigation mode={activeNav} />
        ) : null}
      </MobileNavigation>
    </>
  );
}
