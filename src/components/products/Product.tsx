import Image from "next/image";
import Button from "../ui/Button";

export default function Product() {
  return (
    <article className="h-full bg-amber-100 flex flex-col shadow-sm relative">
      {/* <div className="absolute top-2 left-2 bg-amber-300 font-sans py-2 px-4">
        - 24%
      </div> */}
      <Image
        src="/images/rolex.jpg"
        alt="Rolex watches"
        className="w-full"
        sizes="100vh"
        width={0}
        height={0}
      />
      <div className="pt-8 pb-6 dt-sm:p-4 px-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl capitalize mb-1.5 font-medium mob-sm:text-lg">
            Golden Rolex chronometer
          </h3>
          <div className="flex gap-2 child:font-sans mb-6 child:text-lg items-center">
            <p className="text-lg">$15,500</p>
            {/* <p className="bg-amber-300 py-0.5 px-2">$11,700</p> */}
          </div>
          <p className="font-sans mb-8">
            Elevate your style with this exquisite golden Rolex watch. Designed
            for those who appreciate timeless luxury and impeccable
            craftsmanship, it&apos;s the epitome of refined elegance for the
            modern connoisseur.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button type="secondary">Add to cart</Button>
          <Button type="primary" beforeBackground="before:bg-amber-100">
            Buy now
          </Button>
        </div>
      </div>
    </article>
  );
}
