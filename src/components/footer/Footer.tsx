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
    <footer className="bg-white child:px-44 pb-16">
      <div className="bg-zinc-800 text-zinc-50 flex justify-between py-5">
        <FooterFeature icon={<PiPhoneCallThin />} title="Call us">
          <a href="tel:+555444333" className="hover:text-amber-200">
            555-444-333
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

      <div className="flex justify-between text-zinc-800 font-sans gap-8">
        <AboutUs />
        <Newsletter />
      </div>
    </footer>
  );
}
