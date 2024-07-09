import Order, { Order as OrderType } from "@/models/Order";
import ConnectDB from "../connectDB";
import mongoose from "mongoose";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";

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

export interface OrderStatusCount {
  status: string;
  count: number;
}

interface UserOrderResponse {
  orders: OrderType[];
  statusCounts: OrderStatusCount[];
}

export async function getOrdersByUserId(
  userId: mongoose.ObjectId,
  searchParams: { deliveryStatus?: string }
): Promise<UserOrderResponse> {
  try {
    await ConnectDB();

    const query: { userId: mongoose.ObjectId; delivery_status?: string } = {
      userId: userId,
    };

    if (searchParams.deliveryStatus) {
      query["delivery_status"] = searchParams.deliveryStatus;
    }

    const orders = await Order.find(query).exec();

    const statusCounts = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId.toString()) } },
      {
        $group: {
          _id: "$delivery_status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    const fullStatusCounts: OrderStatusCount[] =
      ORDER_STATUS_FILTER_OPTIONS.map((status) => {
        if (status === "All") return { status, count: 1 };
        const found = statusCounts.find((item) => item.status === status);
        return { status, count: found ? found.count : 0 };
      });

    return { orders, statusCounts: fullStatusCounts };
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    throw error;
  }
}
