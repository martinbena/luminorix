import ConnectDB from "@/db/connectDB";
import { HIGHEST_POSSIBLE_PRICE, LOWEST_POSSIBLE_PRICE } from "@/lib/constants";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse, NextRequest } from "next/server";

interface FilterParams {
  categorySlug: string | null;
  brands: string[];
  colors: string[];
  sizes: string[];
  ratings?: number[];
  minPrice?: number;
  maxPrice?: number;
}

interface FilterCount {
  _id: string;
  count: number;
}

interface PriceData {
  lowestPrice: number;
  highestPrice: number;
}

export interface FiltersResponse {
  brands: FilterCount[];
  colors: FilterCount[];
  sizes: FilterCount[];
  ratings: FilterCount[];
  lowestPrice: number;
  highestPrice: number;
}

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();

    const categorySlug = req.nextUrl.searchParams.get("categorySlug");
    const brandsFilter = req.nextUrl.searchParams.get("brands");
    const colorsFilter = req.nextUrl.searchParams.get("colors");
    const sizesFilter = req.nextUrl.searchParams.get("sizes");
    const minPriceFilter = req.nextUrl.searchParams.get("minPrice");
    const maxPriceFilter = req.nextUrl.searchParams.get("maxPrice");
    const ratingsFilter = req.nextUrl.searchParams.get("ratings");

    const filterParams: FilterParams = {
      categorySlug,
      brands: brandsFilter ? brandsFilter.split(",") : [],
      colors: colorsFilter ? colorsFilter.split(",") : [],
      sizes: sizesFilter ? sizesFilter.split(",") : [],
      minPrice: minPriceFilter ? +minPriceFilter : undefined,
      maxPrice: maxPriceFilter ? +maxPriceFilter : undefined,
      ratings: ratingsFilter ? ratingsFilter.split(",").map((r) => +r) : [],
    };

    const baseMatchStage: Record<string, any> = {};

    if (filterParams.categorySlug) {
      const category = await Category.findOne({
        slug: filterParams.categorySlug,
      });
      if (category) {
        baseMatchStage.category = category._id;
      }
    }

    if (
      filterParams.minPrice !== undefined ||
      filterParams.maxPrice !== undefined
    ) {
      baseMatchStage["variants.price"] = {};
      if (filterParams.minPrice !== undefined) {
        baseMatchStage["variants.price"].$gte = filterParams.minPrice;
      }
      if (filterParams.maxPrice !== undefined) {
        baseMatchStage["variants.price"].$lte = filterParams.maxPrice;
      }
    }

    if (filterParams.ratings && filterParams.ratings.length) {
      const minRating = Math.min(...filterParams.ratings) - 0.3;
      const maxRating = Math.max(...filterParams.ratings) + 0.7;
      baseMatchStage.averageRating = { $gte: minRating, $lte: maxRating };
    }

    const generateMatchStage = (
      exclude: "brands" | "colors" | "sizes" | "ratings"
    ) => {
      const matchStage = { ...baseMatchStage };

      if (exclude !== "brands" && filterParams.brands.length) {
        matchStage.brand = { $in: filterParams.brands };
      }
      if (exclude !== "colors" && filterParams.colors.length) {
        matchStage["variants.color"] = { $in: filterParams.colors };
      }
      if (exclude !== "sizes" && filterParams.sizes.length) {
        matchStage["variants.size"] = { $in: filterParams.sizes };
      }

      return matchStage;
    };

    const brands: FilterCount[] = await Product.aggregate([
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      { $unwind: "$variants" },
      { $match: generateMatchStage("brands") },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
    ]);

    const colors: FilterCount[] = await Product.aggregate([
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      { $unwind: "$variants" },
      { $match: generateMatchStage("colors") },
      { $group: { _id: "$variants.color", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
    ]);

    const ratings = await Product.aggregate([
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      { $unwind: "$variants" },
      { $match: generateMatchStage("ratings") },
      {
        $match: {
          averageRating: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      { $gte: ["$averageRating", 0.7] },
                      { $lt: ["$averageRating", 1.7] },
                    ],
                  },
                  then: 1,
                },
                {
                  case: {
                    $and: [
                      { $gte: ["$averageRating", 1.7] },
                      { $lt: ["$averageRating", 2.7] },
                    ],
                  },
                  then: 2,
                },
                {
                  case: {
                    $and: [
                      { $gte: ["$averageRating", 2.7] },
                      { $lt: ["$averageRating", 3.7] },
                    ],
                  },
                  then: 3,
                },
                {
                  case: {
                    $and: [
                      { $gte: ["$averageRating", 3.7] },
                      { $lt: ["$averageRating", 4.7] },
                    ],
                  },
                  then: 4,
                },
                {
                  case: {
                    $and: [
                      { $gte: ["$averageRating", 4.7] },
                      { $lte: ["$averageRating", 5] },
                    ],
                  },
                  then: 5,
                },
              ],
              default: null,
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          ratings: {
            $push: {
              _id: "$_id",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          ratings: {
            $map: {
              input: [1, 2, 3, 4, 5],
              as: "rating",
              in: {
                _id: "$$rating",
                count: {
                  $ifNull: [
                    {
                      $let: {
                        vars: {
                          ratingCount: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$ratings",
                                  as: "ratingCount",
                                  cond: {
                                    $eq: ["$$ratingCount._id", "$$rating"],
                                  },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        in: "$$ratingCount.count",
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    const sizes: FilterCount[] = await Product.aggregate([
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
        },
      },
      { $unwind: "$variants" },
      { $match: generateMatchStage("sizes") },
      { $group: { _id: "$variants.size", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
    ]);

    const priceData: PriceData[] = await Product.aggregate([
      { $unwind: "$variants" },
      { $match: baseMatchStage },
      {
        $group: {
          _id: null,
          lowestPrice: { $min: "$variants.price" },
          highestPrice: { $max: "$variants.price" },
        },
      },
    ]);

    const lowestPrice = priceData[0]?.lowestPrice || LOWEST_POSSIBLE_PRICE;
    const highestPrice = priceData[0]?.highestPrice || HIGHEST_POSSIBLE_PRICE;

    const response: FiltersResponse = {
      brands,
      colors,
      sizes,
      lowestPrice,
      highestPrice,
      ratings: ratings[0]?.ratings || [
        { _id: 1, count: 0 },
        { _id: 2, count: 0 },
        { _id: 3, count: 0 },
        { _id: 4, count: 0 },
        { _id: 5, count: 0 },
      ],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not get product filters" },
      { status: 500 }
    );
  }
}
