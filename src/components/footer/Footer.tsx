import {
  PiPhoneCallThin,
  PiHandshakeThin,
  PiAirplaneTakeoffThin,
  PiTruckThin,
} from "react-icons/pi";
import FooterFeature from "./FooterFeature";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="bg-zinc-800 text-zinc-50 flex justify-around py-5">
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
    </footer>
  );
}
