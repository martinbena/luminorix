import { ObjectId } from "mongoose";
import ConnectDB from "../connectDB";
import User, { WishlistItem } from "@/models/User";

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

    const user = await User.findById(userId).select("wishlist");
    if (!user) {
      throw new Error("User not found");
    }
    return { wishlist: user.wishlist, count: user.wishlist.length };
  } catch (error) {
    console.error(error);
    throw new Error("Could not get user's wishlist");
  }
}
