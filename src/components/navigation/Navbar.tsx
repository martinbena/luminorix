import Navigation from "./Navigation";
import MobileControlPanel from "./MobileControlPanel";

export default function Navbar() {
  return (
    <>
      <MobileControlPanel />

      {/* Desktop navigation */}
      <aside className="tab:hidden">
        <Navigation />
      </aside>
    </>
  );
}
