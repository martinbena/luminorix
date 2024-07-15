import Order, { CartItemSchema, Order as OrderType } from "@/models/Order";
import ConnectDB from "../connectDB";
import mongoose from "mongoose";
import { ORDER_STATUS_FILTER_OPTIONS, PAGE_LIMIT } from "@/lib/constants";
import { CartItem } from "@/app/contexts/CartContext";

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

export interface CategoryCount {
  category: string;
  amount: number;
}

interface UserOrderResponse {
  orders: OrderType[];
  statusCounts: OrderStatusCount[];
  totalOrdersCount: number;
  totalSpent: number;
  categoryCounts: CategoryCount[];
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

    const totalOrdersCount = await Order.countDocuments(query);

    const totalSpentResult = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSpent: {
            $sum: {
              $cond: {
                if: { $eq: ["$refunded", false] },
                then: "$amount_captured",
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSpent: { $divide: ["$totalSpent", 100] },
        },
      },
    ]);

    const totalSpent = totalSpentResult[0]?.totalSpent ?? 0;

    const categoryCountsResult = await Order.aggregate([
      { $match: { ...query, delivery_status: { $ne: "Cancelled" } } },
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.category",
          amount: {
            $sum: { $multiply: ["$cartItems.quantity", "$cartItems.price"] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: 1,
        },
      },
    ]);

    const orders: OrderType[] = await Order.find(query)
      .skip(userId ? 0 : skip)
      .limit(userId ? 0 : PAGE_LIMIT)
      .exec();

    return {
      orders,
      statusCounts: fullStatusCounts,
      totalOrdersCount,
      totalSpent,
      categoryCounts: categoryCountsResult,
    };
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    throw error;
  }
}

export async function getRecentCartItemsByUserId(
  userId: mongoose.ObjectId
): Promise<CartItemSchema[]> {
  try {
    await ConnectDB();

    const recentCartItems = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId.toString()) } },
      { $sort: { createdAt: -1 } },
      { $unwind: "$cartItems" },
      { $limit: 5 },
      {
        $project: {
          _id: "$cartItems._id",
          sku: "$cartItems.sku",
          brand: "$cartItems.brand",
          color: "$cartItems.color",
          freeShipping: "$cartItems.freeShipping",
          image: "$cartItems.image",
          price: "$cartItems.price",
          size: "$cartItems.size",
          slug: "$cartItems.slug",
          stock: "$cartItems.stock",
          title: "$cartItems.title",
          category: "$cartItems.category",
          quantity: "$cartItems.quantity",
          totalPrice: {
            $multiply: ["$cartItems.quantity", "$cartItems.price"],
          },
          createdAt: 1,
        },
      },
    ]);

    return recentCartItems;
  } catch (error) {
    console.error("Error fetching recent cart items for user:", error);
    throw error;
  }
}
