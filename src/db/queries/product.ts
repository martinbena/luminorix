import Product, { ProductWithVariant, Variant } from "@/models/Product";
import ConnectDB from "../connectDB";
import { productWithVariantFormat } from "./queryOptions";
import { alphanumericSort } from "@/lib/helpers";

export async function getFirstVariantSkuBySlug(slug: string): Promise<string> {
  try {
    await ConnectDB();

    const result = await Product.aggregate([
      { $match: { slug: slug } },
      { $unwind: "$variants" },
      { $limit: 1 },
      { $project: { "variants.sku": 1, _id: 0 } },
    ]);

    return result.length > 0 ? result[0].variants.sku : null;
  } catch (error) {
    console.error("Error in getFirstVariantSkuBySlug:", error);
    throw new Error("Could not get first variant SKU by slug");
  }
}

export async function getProductVariantBySku(
  sku: string
): Promise<ProductWithVariant> {
  try {
    await ConnectDB();

    const result = await Product.aggregate([
      { $unwind: "$variants" },
      { $match: { "variants.sku": sku } },
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      {
        $project: productWithVariantFormat,
      },
      { $limit: 1 },
    ]);

    return result[0];
  } catch (error) {
    console.error("Error in getProductVariantBySku:", error);
    throw new Error("Could not get product variant by SKU");
  }
}

interface SlugSkuCombination {
  slug: string;
  sku: string;
}

export async function getAllSlugSkuCombinations(): Promise<
  SlugSkuCombination[]
> {
  try {
    await ConnectDB();

    const combinations = await Product.aggregate([
      { $unwind: "$variants" },
      {
        $project: {
          _id: 0,
          slug: 1,
          sku: "$variants.sku",
        },
      },
    ]);

    return combinations;
  } catch (error) {
    console.error("Error in getAllSlugSkuCombinations:", error);
    throw new Error("Could not get all slug-SKU combinations");
  }
}

interface RelatedColor {
  sku: string;
  color: string;
}

interface RelatedSize {
  sku: string;
  size: string;
}

interface ColorAndSizeVariants {
  uniqueColors: RelatedColor[];
  sizesByColor: RelatedSize[];
}

export async function getColorAndSizeVariantsBySku(
  sku: string
): Promise<ColorAndSizeVariants> {
  try {
    await ConnectDB();

    const product = await Product.findOne({ "variants.sku": sku });

    if (!product) {
      return { uniqueColors: [], sizesByColor: [] };
    }

    const colorOfSku = product.variants.find(
      (v: Variant) => v.sku === sku
    )?.color;

    if (!colorOfSku) {
      return { uniqueColors: [], sizesByColor: [] };
    }

    const result = await Product.aggregate([
      { $match: { _id: product._id } },
      { $unwind: "$variants" },
      {
        $facet: {
          uniqueColors: [
            {
              $group: {
                _id: "$variants.color",
                sku: { $first: "$variants.sku" },
              },
            },
            {
              $project: {
                _id: 0,
                color: "$_id",
                sku: 1,
              },
            },
            { $sort: { color: 1 } },
          ],
          sizesByColor: [
            { $match: { "variants.color": colorOfSku } },
            {
              $group: {
                _id: "$variants.size",
                sku: { $first: "$variants.sku" },
              },
            },
            {
              $project: {
                _id: 0,
                size: "$_id",
                sku: 1,
              },
            },
          ],
        },
      },
    ]);

    const uniqueColors: RelatedColor[] = result[0]?.uniqueColors.sort() || [];
    const sizesByColor: RelatedSize[] = result[0]?.sizesByColor.sort() || [];

    sizesByColor.sort((a, b) => alphanumericSort(a.size, b.size));

    return { uniqueColors, sizesByColor };
  } catch (error) {
    console.error("Error in getColorAndSizeVariantsBySku:", error);
    throw new Error("Could not get color and size variants by SKU");
  }
}
