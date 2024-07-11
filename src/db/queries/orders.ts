import Order, { Order as OrderType } from "@/models/Order";
import ConnectDB from "../connectDB";
import mongoose from "mongoose";
import { ORDER_STATUS_FILTER_OPTIONS, PAGE_LIMIT } from "@/lib/constants";

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

export async function getOrders(
  searchParams: { deliveryStatus?: string; page?: string },
  userId?: mongoose.ObjectId
): Promise<UserOrderResponse> {
  try {
    await ConnectDB();

    const currentPage = +(searchParams?.page ?? 1);
    const skip = (currentPage - 1) * PAGE_LIMIT;

    const query: {
      userId?: mongoose.Types.ObjectId;
      delivery_status?: string;
    } = {};

    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId?.toString());
    }

    const statusCounts = await Order.aggregate([
      { $match: query },
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

    if (searchParams.deliveryStatus && searchParams.deliveryStatus !== "All") {
      query.delivery_status = searchParams.deliveryStatus;
    }

    const orders: OrderType[] = await Order.find(query)
      .skip(userId ? 0 : skip)
      .limit(userId ? 0 : PAGE_LIMIT)
      .exec();

    return { orders, statusCounts: fullStatusCounts };
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    throw error;
  }
}
