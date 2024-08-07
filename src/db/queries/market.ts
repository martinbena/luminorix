import { PAGE_LIMIT } from "@/lib/constants";
import MarketItem, { MarketItem as MarketItemType } from "@/models/MarketItem";
import mongoose from "mongoose";
import ConnectDB from "../connectDB";

interface MarketItemId {
  marketItemId: string;
}

export async function getAllMarketItemIds(): Promise<MarketItemId[]> {
  try {
    await ConnectDB();
    const marketItemIds = await MarketItem.find().select("_id").exec();

    const idArray = marketItemIds.map((doc) => ({
      marketItemId: doc._id.toString(),
    }));

    return idArray;
  } catch (error) {
    console.error("Error fetching success tokens:", error);
    return [];
  }
}

interface MarketItemsResult {
  marketItems: MarketItemType[];
  totalCount: number;
}

export async function getMarketItems({
  marketItemId,
  userId,
  searchParams,
  limit = false,
}: {
  marketItemId?: string | undefined;
  userId?: string | undefined;
  searchParams?: { page: string };
  limit?: boolean;
}): Promise<MarketItemsResult> {
  try {
    await ConnectDB();
    const currentPage = +(searchParams?.page ?? 1);
    const skip = (currentPage - 1) * PAGE_LIMIT;

    const matchStage: any = {};

    if (marketItemId) {
      matchStage._id = new mongoose.Types.ObjectId(marketItemId);
    }

    if (userId) {
      matchStage.postedBy = new mongoose.Types.ObjectId(userId);
    }

    const totalItems = await MarketItem.aggregate([
      { $match: matchStage },
      { $count: "totalCount" },
    ]);

    const marketItems = await MarketItem.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy",
        },
      },
      { $unwind: "$postedBy" },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "users",
          localField: "responders",
          foreignField: "_id",
          as: "responders",
        },
      },
      {
        $project: {
          _id: 1,
          product: { _id: 1, title: 1 },
          postedBy: { _id: 1, name: 1, email: 1, image: 1 },
          price: 1,
          age: 1,
          condition: 1,
          location: 1,
          issues: 1,
          image: 1,
          responders: { _id: 1, name: 1, image: 1 },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $skip: limit ? skip : 0 },
      { $limit: limit ? PAGE_LIMIT : totalItems[0]?.totalCount || 1 },
    ]);

    return {
      marketItems: JSON.parse(JSON.stringify(marketItems)),
      totalCount: totalItems[0]?.totalCount || 0,
    };
  } catch (error) {
    console.error("Error in getMarketItems:", error);
    throw new Error("Could not get market items from query");
  }
}
