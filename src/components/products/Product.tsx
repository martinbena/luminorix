import Image from "next/image";
import Button from "../ui/Button";
import { ProductWithVariant } from "@/models/Product";
import { formatCurrency } from "@/lib/helpers";
import Link from "next/link";
import paths from "@/lib/paths";

interface ProductProps {
  product: ProductWithVariant;
  hasDescription?: boolean;
}

export default function Product({
  product,
  hasDescription = false,
}: ProductProps) {
  const {
    title,
    price,
    previousPrice,
    description,
    image,
    color,
    size,
    freeShipping,
    slug,
    sku,
  } = product;

  return (
    <article className="h-full bg-amber-100 flex flex-col shadow-sm relative">
      {previousPrice > price || freeShipping ? (
        <div className="absolute top-2 left-2 z-[5] flex gap-2 child:py-2 child:px-4 font-sans">
          {previousPrice > price ? (
            <div className="bg-amber-300">
              - {Math.round(((previousPrice - price) / previousPrice) * 100)}%
            </div>
          ) : null}
          {freeShipping ? (
            <div className="bg-green-400 uppercase">Free shipping</div>
          ) : null}
        </div>
      ) : null}

      <Link
        className="hover:underline relative aspect-square overflow-hidden"
        href={paths.productShow(slug, sku)}
      >
        <Image
          src={image}
          alt={`${title}${color || size ? "," : ""}${color ? ` ${color}` : ""}${
            size ? ` ${size}` : ""
          }`}
          className="object-cover"
          fill
          sizes="50vw"
        />
      </Link>

      <div className="pt-8 pb-6 dt-sm:p-4 px-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl capitalize mb-1.5 font-medium mob-sm:text-lg">
            <Link
              className="hover:underline"
              href={paths.productShow(slug, sku)}
            >
              {`${title}${color || size ? "," : ""}${color ? ` ${color}` : ""}${
                size ? ` ${size}` : ""
              }`}
            </Link>
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
