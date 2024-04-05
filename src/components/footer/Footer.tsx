import {
  PiPhoneCallThin,
  PiHandshakeThin,
  PiAirplaneTakeoffThin,
  PiTruckThin,
} from "react-icons/pi";
import FooterFeature from "./FooterFeature";
import Image from "next/image";
import HeadingTertiary from "../HeadingTertiary";

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

      <div className="pt-10 pb-16">
        <div className="pb-5">
          <div className="grid grid-cols-[1fr_max-content_1fr] text-zinc-6 after:content-[''] after:h-[1px] after:block after:bg-zinc-600 before:content-[''] before:h-[1px] before:block before:bg-zinc-600 gap-4 items-center text-base">
            Seen on
          </div>
        </div>

        <div className="grid grid-cols-4 justify-items-center gap-8 items-center child:brightness-0 child:opacity-80 child-hover:opacity-100 child-hover:brightness-100">
          <Image
            src="/images/forbes.png"
            height={32}
            width={123}
            alt="Logo of Forbes"
          />
          <Image
            src="/images/the-new-york-times.png"
            height={32}
            width={244}
            alt="Logo of The New York Times"
          />
          <Image
            src="/images/usa-today.png"
            height={32}
            width={171}
            alt="Logo of USA Today"
          />
          <Image
            src="/images/business-insider.png"
            height={32}
            width={101}
            alt="Logo of Business Insider"
          />
        </div>
      </div>

      <div className="flex justify-between text-zinc-800 font-sans gap-8">
        <div className="w-1/2">
          <HeadingTertiary>About the shop</HeadingTertiary>
          <p className="pt-6 pb-8">
            Embrace luxury and sophistication with our curated collection,
            embodying timeless elegance and exceptional quality for all
            shoppers.
          </p>
          <p>
            &copy; Copyright 2024 by{" "}
            <span className="text-amber-700">Martin Beňa</span>. All rights
            reserved.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <HeadingTertiary>Newsletter</HeadingTertiary>
          <form className="flex flex-col gap-4" action="">
            <input
              type="text"
              placeholder="Enter email address"
              className="border-2 border-zinc-300 w-96 px-4 py-1"
            />
            <button className="bg-zinc-800 relative text-zinc-200 uppercase py-3 tracking-[0.2em] font-serif hover:text-zinc-800 border-2 border-zinc-800 transition-all duration-[400ms] ease-in-out hover:font-medium before:content-[''] before:absolute before:top-0 before:right-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-500 hover:before:w-full">
              <span className="z-10 relative">Subscribe</span>
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
