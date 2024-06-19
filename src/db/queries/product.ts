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
        $lookup: {
          from: "users",
          localField: "ratings.postedBy",
          foreignField: "_id",
          as: "ratingUsers",
        },
      },
      {
        $addFields: {
          ratings: {
            $map: {
              input: "$ratings",
              as: "rating",
              in: {
                _id: "$$rating._id",
                rating: "$$rating.rating",
                comment: "$$rating.comment",
                postedBy: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$ratingUsers",
                        as: "user",
                        cond: { $eq: ["$$user._id", "$$rating.postedBy"] },
                      },
                    },
                    0,
                  ],
                },
                createdAt: "$$rating.createdAt",
                updatedAt: "$$rating.updatedAt",
              },
            },
          },
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

export interface RelatedColor {
  sku: string;
  color: string;
}

export interface RelatedSize {
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

export async function getRelatedVariantsBySku(
  sku: string
): Promise<ProductWithVariant[]> {
  try {
    await ConnectDB();

    const result = await Product.aggregate([
      { $unwind: "$variants" },
      { $match: { "variants.sku": sku } },
      { $group: { _id: "$_id", category: { $first: "$category" } } },
      {
        $lookup: {
          from: "products",
          let: { categoryId: "$category", excludedSku: sku },
          pipeline: [
            { $match: { $expr: { $eq: ["$category", "$$categoryId"] } } },
            { $unwind: "$variants" },
            { $match: { $expr: { $ne: ["$variants.sku", "$$excludedSku"] } } },
            {
              $project: productWithVariantFormat,
            },
            // { $sample: { size: 4 } },
            { $limit: 4 },
          ],
          as: "relatedVariants",
        },
      },
      { $limit: 4 },
      { $unwind: "$relatedVariants" },
      { $replaceRoot: { newRoot: "$relatedVariants" } },
    ]);

    return result;
  } catch (error) {
    console.error("Error in getRelatedVariantsBySku:", error);
    throw new Error("Could not get related variants by SKU");
  }
}

export async function getRelatedProductsBySku(
  sku: string
): Promise<ProductWithVariant[]> {
  try {
    await ConnectDB();

    const result = await Product.aggregate([
      { $unwind: "$variants" },
      { $match: { "variants.sku": sku } },
      { $group: { _id: "$_id", category: { $first: "$category" } } },
      {
        $lookup: {
          from: "products",
          let: { categoryId: "$category", excludedSku: sku },
          pipeline: [
            { $match: { $expr: { $eq: ["$category", "$$categoryId"] } } },
            { $unwind: "$variants" },
            { $match: { $expr: { $ne: ["$variants.sku", "$$excludedSku"] } } },
            {
              $group: {
                _id: "$_id",
                product: {
                  $first: {
                    title: "$title",
                    slug: "$slug",
                    description: "$description",
                    brand: "$brand",
                    freeShipping: "$freeShipping",
                    soldTotal: "$soldTotal",
                    sku: "$variants.sku",
                    price: "$variants.price",
                    previousPrice: "$variants.previousPrice",
                    color: "$variants.color",
                    size: "$variants.size",
                    stock: "$variants.stock",
                    sold: "$variants.sold",
                    image: "$variants.image",
                    ratings: "$ratings",
                  },
                },
              },
            },
            // { $sample: { size: 4 } },
            { $sort: { "product.sku": 1 } },
            { $limit: 4 },
          ],
          as: "relatedProducts",
        },
      },
      { $project: { _id: 0, relatedProducts: 1 } },
      { $unwind: "$relatedProducts" },
      { $replaceRoot: { newRoot: "$relatedProducts.product" } },
    ]);

    return result;
  } catch (error) {
    console.error("Error in getRelatedProductsBySku:", error);
    throw new Error("Could not get related products by SKU");
  }
}
