import Order from "@/models/Order";
import ConnectDB from "../connectDB";
import mongoose from "mongoose";

interface SuccessToken {
  successToken: string;
}

export async function getAllSuccessTokens(): Promise<SuccessToken[]> {
  try {
    await ConnectDB();
    const successTokens = await Order.find()
      .select("success_token -_id")
      .exec();

    const tokensArray = successTokens.map((doc) => ({
      successToken: doc.success_token,
    }));

    return tokensArray;
  } catch (error) {
    console.error("Error fetching success tokens:", error);
    return [];
  }
}

export async function getOrdersByUserId(userId: mongoose.ObjectId) {
  try {
    await ConnectDB();

    const orders = await Order.find({ userId: userId }).exec();
    return orders;
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    throw error;
  }
}
