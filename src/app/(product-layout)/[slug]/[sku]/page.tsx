import {
  getAllSlugSkuCombinations,
  getColorAndSizeVariantsBySku,
  getProductVariantBySku,
  // getRelatedProductsBySku,
  getRelatedVariantsBySku,
} from "@/db/queries/product";
import { formatCurrency, getDeliveryDateRange } from "@/lib/helpers";
import paths from "@/lib/paths";
import Link from "next/link";
import { notFound } from "next/navigation";
import colorNameList from "color-name-list";
import { PiCalendarBlank, PiHeart, PiTruck } from "react-icons/pi";
import Button from "@/components/ui/Button";
import ProductImage from "@/components/products/ProductImage";
import probe from "probe-image-size";
import SocialNetworks from "@/components/ui/SocialNetworks";
import ProductRow from "@/components/products/ProductRow";
import Product from "@/components/products/Product";
import { ProductWithVariant } from "@/models/Product";
import RatingDistribution from "@/components/products/RatingDistribution";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; sku: string };
}) {
  const { sku } = params;
  const product = await getProductVariantBySku(sku);

  if (!product) notFound();
  const { title, color, size, description } = product;

  return {
    title: `${title}${color || size ? "," : ""}${color ? ` ${color}` : ""}${
      size ? ` ${size}` : ""
    }`,
    description:
      description.length >= 155
        ? `${description.slice(0, 155)}...`
        : `${description}`,
  };
}

export async function generateStaticParams() {
  const slugSkuCombinations = await getAllSlugSkuCombinations();

  return slugSkuCombinations;
}

export default async function SingleProductPage({
  params,
}: {
  params: { slug: string; sku: string };
}) {
  const { sku, slug } = params;

  const product = await getProductVariantBySku(sku);
  if (!product) notFound();

  const {
    title,
    image,
    color,
    size,
    description,
    price,
    previousPrice,
    stock,
    freeShipping,
    ratings,
    averageRating,
  } = product;

  const { uniqueColors, sizesByColor } = await getColorAndSizeVariantsBySku(
    sku
  );

  const { width, height } = await probe(image);

  const relatedProducts = await getRelatedVariantsBySku(sku);

  return (
    <>
      <div className="grid grid-cols-2 gap-16 max-w-8xl mx-auto">
        <div
          className={`relative w-full min-h-[550px] overflow-hidden ${
            Math.round(width / height) === 1 ? "aspect-square" : "aspect-video"
          }`}
        >
          <ProductImage title={title} image={image} size={{ width, height }} />
        </div>
        <div className="font-sans mb-8">
          <h2 className="font-semibold text-3xl">{`${title}${
            color || size ? "," : ""
          }${color ? ` ${color}` : ""}${size ? ` ${size}` : ""}`}</h2>
          <article className="mt-6 mb-8">{description}</article>
          <p className="text-2xl">
            {previousPrice > price && (
              <span className="mr-5 line-through text-zinc-600">
                {formatCurrency(previousPrice)}
              </span>
            )}
            <span className="font-semibold">{formatCurrency(price)}</span>
          </p>
          <hr className="text-zinc-400 my-8" />
          <div>
            <p className="font-semibold mb-6">Color</p>
            <div className="flex gap-6">
              {uniqueColors.map((item) => {
                const hexColor = colorNameList.find(
                  (color) => color.name === item.color
                );
                return (
                  <div
                    key={item.color}
                    className="flex flex-col justify-center gap-2.5"
                  >
                    <Link
                      style={{ backgroundColor: hexColor?.hex }}
                      aria-disabled={color === item.color}
                      tabIndex={color === item.color ? -1 : undefined}
                      className={`w-8 h-8 rounded-full ring-2 ring-offset-4 ${
                        color === item.color ? "ring-zinc-400" : "ring-zinc-200"
                      } hover:ring-zinc-400 transition-colors duration-300 ease-out outline-none focus:ring-zinc-400 ${
                        item.color === color ? "pointer-events-none" : ""
                      }`}
                      href={paths.productShow(slug, item.sku)}
                    >
                      <span>&nbsp;</span>
                    </Link>
                    <p className="capitalize text-zinc-600">{item.color}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-8">
            <p className="font-semibold my-6">Size for this color</p>
            <div className="flex gap-6">
              {sizesByColor.map((item) => (
                <div
                  key={item.size}
                  className="flex flex-col justify-center gap-2.5"
                >
                  <Link
                    aria-disabled={size === item.size}
                    tabIndex={size === item.size ? -1 : undefined}
                    className={`w-8 h-8 rounded-full ring-2 ring-offset-4 ring-offset-white ${
                      size === item.size
                        ? "ring-zinc-400 pointer-events-none"
                        : "ring-zinc-200"
                    } hover:ring-zinc-400 flex justify-center items-center transition-colors duration-300 ease-out outline-none focus:ring-zinc-400`}
                    href={paths.productShow(slug, item.sku)}
                  >
                    <span className="font-medium">{item.size}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-10 font-semibold mb-8">
            <div className="flex items-center gap-1">
              {" "}
              <PiHeart className="w-4 h-4" /> Wishlist{" "}
            </div>
            <p>{stock} in stock</p>
          </div>
          <div className="flex flex-col gap-2 max-w-sixty">
            <Button type="secondary">Add to cart</Button>
            <Button type="primary" beforeBackground="before:bg-white">
              Buy now
            </Button>
          </div>
          <hr className="text-zinc-400 my-8" />
          <div className="flex flex-col gap-6 mb-8">
            <p className="flex items-center gap-1">
              <PiCalendarBlank className="w-5 h-5" />{" "}
              <span className="font-semibold">Delivery:</span>{" "}
              {stock > 0 ? getDeliveryDateRange() : "N/A"}
            </p>
            <p className="flex items-center gap-1">
              <PiTruck className="w-5 h-5" />
              <span className="font-semibold">Shipping:</span>{" "}
              {`${freeShipping ? "Free" : "$5"}`}{" "}
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <p className="font-semibold">Share</p>
            <SocialNetworks
              product={JSON.parse(JSON.stringify(product))}
              slug={slug}
              sku={sku}
            />
          </div>
        </div>
      </div>
      <div className="my-10">
        <ProductRow gridSize="small" title="You might also like">
          {relatedProducts.map((product: ProductWithVariant) => (
            <Product key={product.sku} product={product} />
          ))}
        </ProductRow>
      </div>
      <div>
        <RatingDistribution ratings={ratings} averageRating={averageRating} />
      </div>
    </>
  );
}
