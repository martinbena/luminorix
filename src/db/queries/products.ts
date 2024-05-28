"use server";

import Product, {
  Product as ProductType,
  ProductWithVariant,
} from "@/models/Product";
import ConnectDB from "../connectDB";
import { getSortOption } from "./sortOptions";

export async function getAllProducts(): Promise<ProductType[]> {
  await ConnectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(products));
}

export async function getAllProductsWithVariants(
  sortBy: string
): Promise<ProductWithVariant[]> {
  await ConnectDB();

  const sortOption = getSortOption(sortBy);

  const products = await Product.aggregate([
    { $unwind: "$variants" },
    {
      $addFields: {
        lowercaseTitle: { $toLower: "$title" },
        lowercaseBrand: { $toLower: "$brand" },
      },
    },
    {
      $sort: (sortOption as any) ?? { "variants.createdAt": -1 },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        description: 1,
        brand: 1,
        freeShipping: 1,
        category: 1,
        soldTotal: 1,
        ratings: 1,
        _variantId: "$variants._id",
        sku: "$variants.sku",
        price: "$variants.price",
        previousPrice: "$variants.previousPrice",
        color: "$variants.color",
        size: "$variants.size",
        stock: "$variants.stock",
        sold: "$variants.sold",
        image: "$variants.image",
        variantCreatedAt: "$variants.createdAt",
      },
    },
    { $unset: ["lowercaseTitle", "lowercaseBrand"] },
  ]);

  return JSON.parse(JSON.stringify(products));
}
