"use server";

import Product, {
  Product as ProductType,
  ProductWithVariant,
} from "@/models/Product";
import ConnectDB from "../connectDB";
import { getSortOption, productWithVariantFormat } from "./queryOptions";
import { PAGE_LIMIT } from "@/lib/constants";
import Category, { Category as CategoryType } from "@/models/Category";

export async function getAllProducts(): Promise<ProductType[]> {
  await ConnectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(products));
}

interface ProductsWithVatriantsProps {
  products: ProductWithVariant[];
  totalCount: number;
  currentCategory: CategoryType
}

export async function getProductsWithAllVariants({
  searchParams,
  limit,
}: {
  searchParams?: {
    category?: string;
    maxPrice?: string;
    minPrice?: string;
    color?: string;
    size?: string;
    brand?: string;
    rating?: string;
    sortBy?: string;
    page?: string;
  };
  limit?: number;
}): Promise<ProductsWithVatriantsProps> {
  await ConnectDB();

  const sortOption = getSortOption(searchParams?.sortBy ?? "");

  const currentPage = +(searchParams?.page ?? 1);
  const skip = (currentPage - 1) * PAGE_LIMIT;

  const matchStage: any = {};

  let currentCategory;
  if (searchParams?.category) {
    currentCategory = await Category.findOne({ slug: searchParams.category });
    if (currentCategory) {
      matchStage.category = currentCategory._id;
    } else {
      matchStage.category = null;
    }
  }

  if (searchParams) {
    if (searchParams.maxPrice) {
      matchStage["variants.price"] = {
        ...matchStage["variants.price"],
        $lte: +searchParams.maxPrice,
      };
    }
    if (searchParams.minPrice) {
      matchStage["variants.price"] = {
        ...matchStage["variants.price"],
        $gte: +searchParams.minPrice,
      };
    }
    if (searchParams.color) {
      matchStage["variants.color"] = {
        $regex: new RegExp(searchParams.color, "i"),
      };
    }
    if (searchParams.size) {
      matchStage["variants.size"] = {
        $regex: new RegExp(searchParams.size, "i"),
      };
    }
    if (searchParams.brand) {
      matchStage.brand = { $regex: new RegExp(searchParams.brand, "i") };
    }
    if (searchParams.rating) {
      matchStage["variants.rating"] = { $gte: +searchParams.rating };
    }
  }

  const totalProducts = await Product.aggregate([
    { $unwind: "$variants" },
    { $match: matchStage },
    { $count: "totalCount" },
  ]);

  const products = await Product.aggregate([
    { $unwind: "$variants" },
    { $match: matchStage },
    {
      $addFields: {
        lowercaseTitle: { $toLower: "$title" },
        lowercaseBrand: { $toLower: "$brand" },
      },
    },
    { $sort: (sortOption as any) ?? { "variants.createdAt": -1 } },
    { $project: productWithVariantFormat },
    { $unset: ["lowercaseTitle", "lowercaseBrand"] },
    { $skip: skip },
    { $limit: limit ?? (totalProducts[0]?.totalCount || 1) },
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    totalCount: totalProducts[0]?.totalCount || 0,
    currentCategory
  };
}

export async function getNewestProductsWithVariants(): Promise<
  ProductWithVariant[]
> {
  await ConnectDB();

  const products = await Product.aggregate([
    { $unwind: "$variants" },
    {
      $sort: { "variants.createdAt": -1 },
    },
    { $limit: 3 },
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
      $match: {
        discountPercentage: { $gt: 0 },
      },
    },
    {
      $sort: { discountPercentage: -1 },
    },
    { $limit: limit ?? 10000 },
    {
      $project: productWithVariantFormat,
    },
  ]);

  return JSON.parse(JSON.stringify(products));
}

export async function getProductsWithFreeShipping(): Promise<
  ProductWithVariant[]
> {
  await ConnectDB();

  const products = await Product.aggregate([
    { $unwind: "$variants" },
    {
      $match: {
        freeShipping: { $eq: true },
      },
    },
    {
      $sort: { "variants.createdAt": -1 },
    },
    {
      $project: productWithVariantFormat,
    },
  ]);

  return JSON.parse(JSON.stringify(products));
}
