import Product, { ProductWithVariant } from "@/models/Product";
import { productWithVariantFormat } from "./queryOptions";

interface SearchResult {
  data: ProductWithVariant[];
  count: number;
}

export async function getSearchedProducts(term: string): Promise<SearchResult> {
  const regex = new RegExp(term, "i");

  const results = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $unwind: "$variants",
    },
    {
      $addFields: {
        averageRating: { $avg: "$ratings.rating" },
        category: {
          _id: "$categoryInfo._id",
          title: "$categoryInfo.title",
          slug: "$categoryInfo.slug",
        },
      },
    },
    {
      $match: {
        $or: [
          { title: regex },
          { description: regex },
          { "variants.sku": regex },
          { "variants.color": regex },
          { "variants.size": regex },
          { "categoryInfo.title": regex },
        ],
      },
    },
    {
      $project: productWithVariantFormat,
    },
    {
      $facet: {
        data: [],
        count: [{ $count: "total" }],
      },
    },
  ]).exec();

  const data = results[0]?.data ?? [];
  const count = results[0]?.count[0]?.total ?? 0;

  return { data, count };
}
