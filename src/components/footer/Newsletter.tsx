import HeadingTertiary from "../HeadingTertiary";

export default function Newsletter() {
  return (
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
  );
}
