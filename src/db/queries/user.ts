import Product, { Rating } from "@/models/Product";
import mongoose from "mongoose";
import ConnectDB from "../connectDB";

export interface UserRating {
  title: string;
  slug: string;
  review: Rating;
}

export async function getUserReviews(userId: string): Promise<UserRating[]> {
  try {
    await ConnectDB();

    const reviews = await Product.aggregate([
      { $unwind: "$ratings" },
      { $match: { "ratings.postedBy": new mongoose.Types.ObjectId(userId) } },
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
    ]);

    return reviews;
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
