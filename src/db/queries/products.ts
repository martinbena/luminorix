"use server";

import Product, {
  Product as ProductType,
  ProductWithVariant,
} from "@/models/Product";
import ConnectDB from "../connectDB";
import { getSortOption } from "./sortOptions";
import { PAGE_LIMIT } from "@/lib/constants";

export async function getAllProducts(): Promise<ProductType[]> {
  await ConnectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(products));
}

interface ProductsWithVatriantsProps {
  products: ProductWithVariant[];
  totalCount: number;
}

export async function getAllProductsWithVariants(
  sortBy: string,
  page: number = 1
): Promise<ProductsWithVatriantsProps> {
  await ConnectDB();

  const sortOption = getSortOption(sortBy);

  const skip = (page - 1) * PAGE_LIMIT;

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
    { $skip: skip },
    { $limit: PAGE_LIMIT },
  ]);

  const totalProducts = await Product.aggregate([
    { $unwind: "$variants" },
    { $count: "totalCount" },
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    totalCount: totalProducts[0]?.totalCount || 0,
  };
}
