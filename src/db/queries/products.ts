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
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

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
  currentCategory: CategoryType | undefined | null;
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
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
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
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.error("Error in getProductsWithAllVariants:", error);
    throw new Error("Could not get products from query");
  }
}

export async function getNewestProductsWithVariants(): Promise<
  ProductWithVariant[]
> {
  try {
    await ConnectDB();

    const products = await Product.aggregate([
      { $unwind: "$variants" },
      { $match: { "variants.stock": { $gt: 0 } } },
      {
        $sort: { "variants.createdAt": -1 },
      },
      { $limit: 3 },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: productWithVariantFormat,
      },
    ]);

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    throw new Error("Could not get newest products");
  }
}

type DiscountsMatchStage = {
  discountPercentage: { $gt: number };
  [key: string]: any;
};

export async function getProductsWithDiscounts(
  limit?: number,
  checkStock: boolean = false
): Promise<ProductWithVariant[]> {
  try {
    await ConnectDB();

    const matchStage: DiscountsMatchStage = {
      discountPercentage: { $gt: 0 },
    };

    if (checkStock) {
      matchStage["variants.stock"] = { $gt: 0 };
    }

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
        $match: matchStage,
      },
      {
        $sort: { discountPercentage: -1 },
      },
      { $limit: limit ?? 10000 },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
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
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: productWithVariantFormat,
      },
    ]);

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    throw new Error("Could not get products with free shipping");
  }
}

export async function getTopSellingProductVariants(categorySlug?: string) {
  try {
    await ConnectDB();

    let matchStage = {};

    if (categorySlug) {
      const currentCategory = await Category.findOne({ slug: categorySlug });

      if (currentCategory) {
        matchStage = { category: currentCategory._id };
      }
    }

    const topSellingVariants = await Product.aggregate([
      {
        $match: matchStage,
      },
      {
        $unwind: "$variants",
      },
      {
        $sort: {
          "variants.sold": -1,
        },
      },
      {
        $limit: 3,
      },
      {
        $project: productWithVariantFormat,
      },
    ]);

    return topSellingVariants;
  } catch (error) {
    console.error("Error in getTopSellingProductVariants:", error);
    throw new Error("Could not get top selling product variants");
  }
}

export async function updateVariantStockBySku(
  sku: string,
  quantity: number,
  operation: "increment" | "decrement"
): Promise<void> {
  try {
    await ConnectDB();

    const updateOperation =
      operation === "increment"
        ? { $inc: { "variants.$.stock": quantity } }
        : { $inc: { "variants.$.stock": -quantity } };

    const result = await Product.updateOne(
      { "variants.sku": sku },
      updateOperation
    );

    if (result.matchedCount === 0) {
      throw new Error(`Variant with SKU ${sku} not found.`);
    }

    console.log(`Variant with SKU ${sku} successfully updated.`);
  } catch (error) {
    console.error("Error in updateVariantStockBySku:", error);
    throw new Error("Could not update variant stock by SKU");
  }
}

export async function updateProductAndVariantSold(
  sku: string,
  quantity: number,
  operation: "increment" | "decrement"
) {
  try {
    await ConnectDB();

    const adjustment = operation === "increment" ? quantity : -quantity;

    const result = await Product.updateOne(
      { "variants.sku": sku },
      {
        $inc: {
          soldTotal: adjustment,
          "variants.$.sold": adjustment,
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error(`No product found with variant SKU: ${sku}`);
    }

    console.log(`Successfully updated product and variant for SKU: ${sku}`);
  } catch (error) {
    console.error("Error updating product and variant sold counts:", error);
  }
}
