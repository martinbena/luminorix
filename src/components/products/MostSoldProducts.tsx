import { getTopSellingProductVariants } from "@/db/queries/products";
import { formatCurrency, getProductVariantTitle } from "@/lib/helpers";
import HeadingSecondary from "../ui/HeadingSecondary";
import Image from "next/image";
import Link from "next/link";
import paths from "@/lib/paths";
import HeadingTertiary from "../ui/HeadingTertiary";

interface MostSoldProductsProps {
  category: string | undefined;
}

export default async function MostSoldProducts({
  category,
}: MostSoldProductsProps) {
  const topProducts = await getTopSellingProductVariants(category);
  return (
    <section className="px-8 mob:px-5">
      <HeadingSecondary>{category ?? "All sortiment"}</HeadingSecondary>
      <div className="flex flex-col gap-6 max-w-max mx-auto mt-8 mb-2">
        <div className="mb-2 text-center mob:text-left">
          <HeadingTertiary>Best sellers</HeadingTertiary>
        </div>
        {topProducts.map((product, index) => {
          const title = getProductVariantTitle(
            product.title,
            product.color,
            product.size
          );
          return (
            <div
              key={product.sku}
              className="grid grid-cols-[max-content_1fr_max-content] items-center gap-8 mob:gap-5"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full flex justify-center items-center text-lg font-sans font-semibold h-8 w-8 ${
                    index === 0 && "bg-yellow-300"
                  } ${index === 1 && "bg-gray-200"} ${
                    index === 2 && "bg-amber-500"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="relative aspect-square overflow-hidden h-10 w-10 mob:hidden">
                  <Image
                    src={product.image}
                    fill
                    alt={title}
                    className="object-fit"
                  />
                </div>
              </div>
              <Link
                className="hover:underline text-lg mob-sm:text-base"
                href={paths.productShow(product.slug, product.sku)}
              >
                {title}
              </Link>
              <p className="text-lg justify-self-start font-sans font-semibold text-amber-600 mob-sm:text-base">
                {formatCurrency(product.price)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
