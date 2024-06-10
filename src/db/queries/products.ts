"use server";

import Product, {
  Product as ProductType,
  ProductWithVariant,
} from "@/models/Product";
import ConnectDB from "../connectDB";
import {
  ProductSearchParams,
  getSortOption,
  productWithVariantFormat,
} from "./queryOptions";
import { PAGE_LIMIT } from "@/lib/constants";
import Category, { Category as CategoryType } from "@/models/Category";

export async function getAllProducts(): Promise<ProductType[]> {
  try {
    await ConnectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    throw new Error("Could not get products");
  }
}

interface ProductsWithVatriantsProps {
  products: ProductWithVariant[];
  totalCount: number;
  currentCategory: CategoryType;
}

export async function getProductsWithAllVariants({
  searchParams,
  limit = false,
}: {
  searchParams?: ProductSearchParams;
  limit?: boolean;
}): Promise<ProductsWithVatriantsProps> {
  try {
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
      if (searchParams.colors) {
        const colorsArray = searchParams.colors.split(",");
        matchStage["variants.color"] = {
          $in: colorsArray.map((color) => new RegExp(color, "i")),
        };
      }
      if (searchParams.sizes) {
        const sizesArray = searchParams.sizes.split(",");
        matchStage["variants.size"] = {
          $in: sizesArray.map((size) => new RegExp(size, "i")),
        };
      }
      if (searchParams.brands) {
        const brandsArray = searchParams.brands.split(",");
        matchStage.brand = {
          $in: brandsArray.map((brand) => new RegExp(brand, "i")),
        };
      }
      if (searchParams.ratings) {
        const ratingsArray = searchParams.ratings.split(",").map(Number);
        matchStage.averageRating = {
          $gte: Math.min(...ratingsArray) - 0.3,
          $lte: Math.max(...ratingsArray) + 0.7,
        };
      }
    }

    const totalProducts = await Product.aggregate([
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      { $unwind: "$variants" },
      { $match: matchStage },
      { $count: "totalCount" },
    ]);

    const products = await Product.aggregate([
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      { $unwind: "$variants" },
      {
        $addFields: {
          lowercaseTitle: { $toLower: "$title" },
          lowercaseBrand: { $toLower: "$brand" },
        },
      },
      { $match: matchStage },
      { $sort: (sortOption as any) ?? { "variants.createdAt": -1 } },
      { $project: productWithVariantFormat },
      { $unset: ["lowercaseTitle", "lowercaseBrand"] },
      { $skip: limit ? skip : 0 },
      { $limit: limit ? PAGE_LIMIT : totalProducts[0]?.totalCount || 1 },
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      totalCount: totalProducts[0]?.totalCount || 0,
      currentCategory,
    };
  } catch (error) {
    throw new Error("Could not get products");
  }
}

export async function getNewestProductsWithVariants(): Promise<
  ProductWithVariant[]
> {
  try {
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
  } catch (error) {
    throw new Error("Could not get newest products");
  }
}

export async function getProductsWithDiscounts(
  limit?: number
): Promise<ProductWithVariant[]> {
  try {
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
                        $subtract: [
                          "$variants.previousPrice",
                          "$variants.price",
                        ],
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
  } catch (error) {
    throw new Error("Could not get products with discounts");
  }
}

export async function getProductsWithFreeShipping(): Promise<
  ProductWithVariant[]
> {
  try {
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
  } catch (error) {
    throw new Error("Could not get products with free shipping");
  }
}
