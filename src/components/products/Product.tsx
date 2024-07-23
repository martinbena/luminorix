import Image from "next/image";
import { ProductWithVariant } from "@/models/Product";
import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import Link from "next/link";
import paths from "@/lib/paths";
import Tags from "./Tags";
import CartActions from "../cart/CartActions";
import { MarketItem } from "@/models/MarketItem";
import { PiClock } from "react-icons/pi";
import { formatDistanceToNowStrict } from "date-fns";

interface ProductProps {
  product: ProductWithVariant | MarketItem;
  hasDescription?: boolean;
}

export default function Product({
  product,
  hasDescription = false,
}: ProductProps) {
  const isProductWithVariant = (product: any): product is ProductWithVariant =>
    product.sku !== undefined;

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
  } = product as ProductWithVariant;

  const composedTitle = isProductWithVariant(product)
    ? getProductVariantTitle(title, color, size)
    : title;

  return (
    <article
      className={`h-full flex flex-col shadow-sm relative ${
        isProductWithVariant(product) ? "bg-amber-100" : "bg-zinc-50"
      }`}
    >
      {(isProductWithVariant(product) && previousPrice > price) ||
      freeShipping ? (
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
        href={
          isProductWithVariant(product)
            ? paths.productShow(slug, sku)
            : paths.marketItemShow(product._id)
        }
        tabIndex={-1}
      >
        <Image
          src={image}
          alt={
            isProductWithVariant(product)
              ? composedTitle
              : (product as MarketItem).product.title
          }
          className="object-cover"
          fill
          sizes="50vw"
        />
      </Link>

      <div className="pt-8 pb-6 dt-sm:p-4 px-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl capitalize mb-1.5 font-medium mob-sm:text-lg">
            <Link
              className="hover:underline focus:outline-none focus:underline"
              href={
                isProductWithVariant(product)
                  ? paths.productShow(slug, sku)
                  : paths.marketItemShow(product._id)
              }
            >
              {isProductWithVariant(product)
                ? composedTitle
                : (product as MarketItem).product.title}
            </Link>
          </h3>
          <div className="flex gap-2 child:font-sans mb-6 child:text-lg items-center">
            <p
              className={`text-lg ${
                isProductWithVariant(product) && previousPrice > price
                  ? "line-through"
                  : ""
              }`}
            >
              {isProductWithVariant(product) && previousPrice > price
                ? formatCurrency(previousPrice)
                : formatCurrency(price)}
            </p>
            {isProductWithVariant(product) && previousPrice > price ? (
              <p className="bg-amber-300 py-0.5 px-2">
                {formatCurrency(price)}
              </p>
            ) : null}
          </div>
          {hasDescription ? (
            <p className="font-sans mb-8">{description}</p>
          ) : null}
        </div>
        {isProductWithVariant(product) && stock >= 1 ? (
          <CartActions
            product={JSON.parse(JSON.stringify(product))}
            beforeBackground={"before:bg-amber-100"}
          />
        ) : isProductWithVariant(product) ? (
          <p className="bg-pink-100 py-2 px-4 text-pink-800 uppercase text-center tracking-[0.2em]">
            Not available
          </p>
        ) : (
          <div className="flex justify-between mob-sm:flex-col mob-sm:items-start mob-sm:gap-1.5 mob-sm:-mt-3 items-center font-sans">
            <p>
              Condition:{" "}
              <span className="font-medium">{product.condition}</span>{" "}
            </p>
            <p className="mob:text-xs flex gap-1 items-center">
              <PiClock />{" "}
              {formatDistanceToNowStrict(new Date(product.createdAt))} ago
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
