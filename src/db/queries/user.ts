import Product, { Rating } from "@/models/Product";
import mongoose from "mongoose";
import ConnectDB from "../connectDB";

export interface UserRating {
  title: string;
  slug: string;
  review: Rating;
}

export interface UserReviewsResponse {
  reviews: UserRating[];
  totalReviews: number;
}

export async function getUserReviews(
  userId: string
): Promise<UserReviewsResponse> {
  try {
    await ConnectDB();

    const results = await Product.aggregate([
      { $unwind: "$ratings" },
      { $match: { "ratings.postedBy": new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          reviews: [
            {
              $project: {
                _id: 0,
                title: 1,
                slug: 1,
                review: {
                  rating: "$ratings.rating",
                  comment: "$ratings.comment",
                  postedBy: "$ratings.postedBy",
                  createdAt: "$ratings.createdAt",
                  updatedAt: "$ratings.updatedAt",
                },
              },
            },
          ],
          totalReviews: [{ $count: "count" }],
        },
      },
    ]);

    const reviews = results[0].reviews;
    const totalReviews = results[0].totalReviews[0]?.count ?? 0;

    return { reviews, totalReviews };
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
}

export async function hasUserReviewedProduct(
  productSlug: string,
  userId: string
): Promise<boolean> {
  try {
    await ConnectDB();

    const result = await Product.aggregate([
      { $match: { slug: productSlug } },
      { $unwind: "$ratings" },
      { $match: { "ratings.postedBy": new mongoose.Types.ObjectId(userId) } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          reviewed: { $literal: true },
        },
      },
    ]);

    return result.length > 0;
  } catch (error) {
    console.error("Error checking if user reviewed the product:", error);
    throw error;
  }
}
