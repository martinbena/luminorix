import { ObjectId } from "mongoose";
import ConnectDB from "../connectDB";
import User, { User as UserType, WishlistItem } from "@/models/User";
import mongoose from "mongoose";

export async function isProductInWishlist(
  userId: ObjectId,
  sku: string
): Promise<boolean> {
  try {
    ConnectDB();

    const user = await User.findOne({
      _id: userId,
      "wishlist.sku": sku,
    });

    return !!user;
  } catch (error) {
    console.error("Error checking wishlist:", error);
    throw new Error("Could not check if product is in wishlist");
  }
}

interface WishlistResponse {
  wishlist: WishlistItem[];
  count: number;
}

export async function getAllWishlistedItems(
  userId: ObjectId | undefined
): Promise<WishlistResponse> {
  try {
    await ConnectDB();

    const userWishlist = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId ? userId.toString() : 0),
        },
      },
      { $unwind: "$wishlist" },
      {
        $lookup: {
          from: "categories",
          localField: "wishlist.category",
          foreignField: "_id",
          as: "wishlist.category",
        },
      },
      { $unwind: "$wishlist.category" },
      {
        $group: {
          _id: "$_id",
          wishlist: { $push: "$wishlist" },
        },
      },
      {
        $project: {
          wishlist: 1,
          count: { $size: "$wishlist" },
        },
      },
    ]);

    if (!userWishlist.length) return { wishlist: [], count: 0 };

    return { wishlist: userWishlist[0].wishlist, count: userWishlist[0].count };
  } catch (error) {
    console.error(error);
    throw new Error("Could not get user's wishlist");
  }
}

export async function getUserWishlistInfo(userId: string) {
  try {
    const user: UserType | null = await User.findById(userId)
      .select("wishlist")
      .lean();

    if (!user) {
      throw new Error("User not found");
    }

    const wishlistCount = user.wishlist.length;
    const allWishlistSkus = user.wishlist.map((item) => item.sku);

    return {
      wishlistCount,
      allWishlistSkus,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user wishlist information");
  }
}

export async function getAllWishlistItems() {
  try {
    const result = await User.aggregate([
      {
        $project: {
          _id: 0,
          user: "$_id",
          wishlistItems: "$wishlist.sku",
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    throw error;
  }
}
