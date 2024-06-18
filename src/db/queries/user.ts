import { ObjectId } from "mongoose";
import ConnectDB from "../connectDB";
import User from "@/models/User";

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
