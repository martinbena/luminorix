import { getFirstVariantSkuBySlug } from "@/db/queries/product";
import { notFound, redirect } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const sku = await getFirstVariantSkuBySlug(slug);

  if (!sku) notFound();

  redirect(`/${slug}/${sku}`);
}
