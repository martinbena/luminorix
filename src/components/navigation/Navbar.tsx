import MobileControlPanel from "./MobileControlPanel";
import Navigation from "./Navigation";

interface NavbarProps {
  mode: "shop" | "user" | "admin";
}

export default function Navbar({ mode }: NavbarProps) {
  return (
    <div className="bg-zinc-50 overflow-hidden">
      <MobileControlPanel mode={mode} />
      <aside className="tab:hidden">
        <Navigation mode={mode} />
      </aside>
    </div>
  );
}
