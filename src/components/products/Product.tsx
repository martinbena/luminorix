import Image from "next/image";
import Button from "../ui/Button";
import { ProductWithVariant } from "@/models/Product";
import { formatCurrency } from "@/lib/helpers";

interface ProductProps {
  product: ProductWithVariant;
  hasDescription?: boolean;
}

export default function Product({
  product,
  hasDescription = false,
}: ProductProps) {
  const { title, price, previousPrice, description, image, color, size } =
    product;

  return (
    <article className="h-full bg-amber-100 flex flex-col shadow-sm relative">
      {previousPrice > price ? (
        <div className="absolute z-[5] top-2 left-2 bg-amber-300 font-sans py-2 px-4">
          - {Math.round(((previousPrice - price) / previousPrice) * 100)}%
        </div>
      ) : null}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={`${title}${color || size ? "," : ""}${color ? ` ${color}` : ""}${
            size ? ` ${size}` : ""
          }`}
          className="object-cover"
          fill
          sizes="50vw"
        />
      </div>

      <div className="pt-8 pb-6 dt-sm:p-4 px-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl capitalize mb-1.5 font-medium mob-sm:text-lg">
            {`${title}${color || size ? "," : ""}${color ? ` ${color}` : ""}${
              size ? ` ${size}` : ""
            }`}
          </h3>
          <div className="flex gap-2 child:font-sans mb-6 child:text-lg items-center">
            <p
              className={`text-lg ${
                previousPrice > price ? "line-through" : ""
              }`}
            >
              {previousPrice > price
                ? formatCurrency(previousPrice)
                : formatCurrency(price)}
            </p>
            {previousPrice > price ? (
              <p className="bg-amber-300 py-0.5 px-2">
                {formatCurrency(price)}
              </p>
            ) : null}
          </div>
          {hasDescription ? (
            <p className="font-sans mb-8">{description}</p>
          ) : null}
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
