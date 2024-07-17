import Image from "next/image";
import { ProductWithVariant } from "@/models/Product";
import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import Link from "next/link";
import paths from "@/lib/paths";
import Tags from "./Tags";
import CartActions from "../cart/CartActions";

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
    stock,
  } = product;

  const composedTitle = getProductVariantTitle(title, color, size);

  return (
    <article className="h-full bg-amber-100 flex flex-col shadow-sm relative">
      {previousPrice > price || freeShipping ? (
        <div className="absolute top-2 left-2 z-[5]">
          <Tags
            previousPrice={previousPrice}
            price={price}
            freeShipping={freeShipping}
          />
        </div>
      ) : null}

      <Link
        className="relative aspect-square overflow-hidden"
        href={paths.productShow(slug, sku)}
        tabIndex={-1}
      >
        <Image
          src={image}
          alt={composedTitle}
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
              {composedTitle}
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
        {stock >= 1 ? (
          <CartActions
            product={JSON.parse(JSON.stringify(product))}
            beforeBackground={"before:bg-amber-100"}
          />
        ) : (
          <p className="bg-pink-100 py-2 px-4 text-pink-800 uppercase text-center tracking-[0.2em]">
            Not available
          </p>
        )}
      </div>
    </article>
  );
}
