import Image from "next/image";

export default function Media() {
  return (
    <div className="pt-10 pb-16">
      <div className="pb-5">
        <div className="grid grid-cols-[1fr_max-content_1fr] text-zinc-6 after:content-[''] after:h-[1px] after:block after:bg-zinc-600 before:content-[''] before:h-[1px] before:block before:bg-zinc-600 gap-4 items-center text-base">
          Seen on
        </div>
      </div>

      <div className="grid grid-cols-4 mob:gap-4 mob-lg:grid-cols-2 justify-items-center gap-8 items-center child:brightness-0 child:opacity-80 child-hover:opacity-100 child-hover:brightness-100">
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
  );
}
