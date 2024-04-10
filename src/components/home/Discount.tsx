import HeadingSecondary from "../HeadingSecondary";
import HeadingTertiary from "../HeadingTertiary";

export default function Discount() {
  return (
    <div className="grid grid-cols-[2fr_3fr] h-60">
      <div className="bg-amber-50 py-8 px-16 flex flex-col justify-between">
        <div>
          {/* <HeadingSecondary>Limited offer</HeadingSecondary> */}
          <HeadingTertiary>Limited offer</HeadingTertiary>
          <p className="tracking-[0.2em] font-medium text-xl mt-6">
            10% discount on all jewellery
          </p>
        </div>
        <button className="bg-zinc-800 relative text-zinc-200 uppercase py-3 tracking-[0.2em] font-serif hover:text-zinc-800 border-2 border-zinc-800 transition-all duration-[400ms] ease-in-out hover:font-medium before:content-[''] before:absolute before:top-0 before:right-0 before:h-full before:w-0 before:bg-amber-50 before:transition-all before:duration-500 hover:before:w-full">
          <span className="z-10 relative">View all</span>
        </button>
      </div>
      <div className="bg-discount-banner bg-cover bg-center"></div>
    </div>
  );
}
