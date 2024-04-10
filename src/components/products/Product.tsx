import Image from "next/image";
import Button from "../Button";

export default function Product() {
  return (
    <article className="h-full bg-amber-100 flex flex-col shadow-sm">
      <Image
        src="/images/rolex.jpg"
        alt="Rolex watches"
        className="w-full"
        sizes="100vh"
        width={0}
        height={0}
      />
      <div className="pt-8 pb-6 px-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl capitalize mb-1">Golden Rolex chronometer</h3>
          <p className="text-lg fotn-medium font-sans">$15,500</p>
          <p className="font-sans my-4">
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
