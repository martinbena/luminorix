"use server";

import Product, {
  Product as ProductType,
  ProductWithVariant,
} from "@/models/Product";
import ConnectDB from "../connectDB";
import { getSortOption, productWithVariantFormat } from "./queryOptions";
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
  sortBy?: string,
  page: number = 1
): Promise<ProductsWithVatriantsProps> {
  await ConnectDB();

  const sortOption = getSortOption(sortBy ?? "");

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
      $project: productWithVariantFormat,
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

export async function getNewestProductsWithVariants(): Promise<
  ProductWithVariant[]
> {
  await ConnectDB();

  const products = await Product.aggregate([
    { $unwind: "$variants" },
    { $limit: 3 },
    {
      $sort: { "variants.createdAt": -1 },
    },
    {
      $project: productWithVariantFormat,
    },
  ]);

  return JSON.parse(JSON.stringify(products));
}

export async function getProductsWithDiscounts(
  limit?: number
): Promise<ProductWithVariant[]> {
  await ConnectDB();

  const products = await Product.aggregate([
    { $unwind: "$variants" },
    {
      $addFields: {
        discountPercentage: {
          $cond: {
            if: { $gt: ["$variants.previousPrice", 0] },
            then: {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: ["$variants.previousPrice", "$variants.price"],
                    },
                    "$variants.previousPrice",
                  ],
                },
                100,
              ],
            },
            else: 0,
          },
        },
      },
    },
    {
      $sort: { discountPercentage: -1 },
    },
    { $limit: limit ?? 0 },
    {
      $project: productWithVariantFormat,
    },
  ]);

  return JSON.parse(JSON.stringify(products));
}
