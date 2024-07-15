import { ObjectId } from "mongoose";
import ConnectDB from "../connectDB";
import User, { WishlistItem } from "@/models/User";
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
