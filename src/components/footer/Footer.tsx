import {
  PiPhoneCallThin,
  PiHandshakeThin,
  PiAirplaneTakeoffThin,
  PiTruckThin,
} from "react-icons/pi";
import FooterFeature from "./FooterFeature";
import Media from "./Media";
import AboutUs from "./AboutUs";
import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer className="bg-white child:px-44 dt:child:px-8 pb-16 mob:child:px-5">
      <div className="bg-zinc-800 text-zinc-50 grid grid-cols-4 justify-items-center gap-8 tab-lg:grid-cols-2 tab-lg:justify-items-stretch py-5 tab-lg:px-36 tab:px-8 mob:grid-cols-1 mob:gap-4">
        <FooterFeature icon={<PiPhoneCallThin />} title="Call us">
          <a href="tel:+5554443333" className="hover:text-amber-200">
            555-444-3333
          </a>
        </FooterFeature>

        <FooterFeature icon={<PiHandshakeThin />} title="Free market">
          for our users
        </FooterFeature>

        <FooterFeature icon={<PiAirplaneTakeoffThin />} title="Fast delivery">
          over the world
        </FooterFeature>

        <FooterFeature icon={<PiTruckThin />} title="Fixed shipping">
          only $5
        </FooterFeature>
      </div>

      <Media />

      {/* <div className="flex justify-between text-zinc-800 font-sans gap-8 mob-lg:flex-col"> */}
      <div className="grid grid-cols-[2fr_1fr] text-zinc-800 font-sans gap-8 mob-lg:grid-cols-1">
        <AboutUs />
        <Newsletter />
      </div>
    </footer>
  );
}
