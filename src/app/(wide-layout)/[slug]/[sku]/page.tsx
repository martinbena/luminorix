import { auth } from "@/auth";
import ProductBreadcrumb from "@/components/navigation/ProductBreadcrumb";
import AddEditRatingForm from "@/components/products/AddEditRatingForm";
import ProductDetails from "@/components/products/ProductDetails";
import ProductImage from "@/components/products/ProductImage";
import ProductRowSkeleton from "@/components/products/ProductRowSkeleton";
import RatingDistribution from "@/components/products/RatingDistribution";
import Ratings from "@/components/products/Ratings";
import RelatedProducts from "@/components/products/RelatedProducts";
import {
  getAllSlugSkuCombinations,
  getProductVariantsBySkus,
} from "@/db/queries/product";
import { getProductVariantTitle } from "@/lib/helpers";
import paths from "@/lib/paths";
import { Category } from "@/models/Category";
import Link from "next/link";
import { notFound } from "next/navigation";
import probe from "probe-image-size";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; sku: string };
}) {
  const { sku } = params;
  const [product] = await getProductVariantsBySkus(sku);

  if (!product) notFound();
  const { title, color, size, description } = product;

  return {
    title: getProductVariantTitle(title, color, size),
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
  const [product] = await getProductVariantsBySkus(sku);

  if (!product) notFound();

  const { title, image, ratings, averageRating, category } = product;
  const { width, height } = await probe(image);
  const session = await auth();
  const hasUserRated = session?.user
    ? ratings.some(
        (rating) => rating.postedBy._id.toString() === session.user._id
      )
    : false;
  return (
    <>
      <ProductBreadcrumb
        productTitle={title}
        productCategory={category as Category}
      />
      <div className="grid grid-cols-2 gap-16 max-w-8xl mx-auto tab:grid-cols-1 tab:gap-8 text-zinc-800">
        <div className="flex flex-col gap-1.5">
          <ProductImage title={title} image={image} size={{ width, height }} />
          <div className="text-base">
            <p>
              <span className="font-semibold">SKU:</span> {sku}
            </p>
          </div>
        </div>
        <ProductDetails product={product} slug={slug} sku={sku} />
      </div>
      <Suspense fallback={<ProductRowSkeleton numItems={4} hasTitle />}>
        <RelatedProducts sku={sku} />
      </Suspense>
      <div className="grid grid-cols-2 mt-16 mb-4 gap-16 tab-xl:gap-4 tab:grid-cols-1 tab:gap-16">
        <div className="flex flex-col gap-8">
          <RatingDistribution ratings={ratings} averageRating={averageRating} />
          {session?.user ? (
            !hasUserRated ? (
              <AddEditRatingForm productSlug={slug} />
            ) : (
              <p className="text-base text-center">
                You have already rated this product. Visit your{" "}
                <Link
                  className="underline text-amber-600"
                  href={paths.userReviews()}
                >
                  profile
                </Link>{" "}
                for edit.
              </p>
            )
          ) : null}
        </div>
        <Ratings ratings={JSON.parse(JSON.stringify(ratings))} />
      </div>
    </>
  );
}
