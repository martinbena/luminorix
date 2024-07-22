import Message, { Message as MessageType } from "@/models/Message";
import ConnectDB from "../connectDB";
import mongoose from "mongoose";

export async function getMessages(
  userId: string
): Promise<{ messages: MessageType[]; unreadCount: number }> {
  try {
    await ConnectDB();
    const id = new mongoose.Types.ObjectId(userId);
    const result = await Message.aggregate([
      {
        $match: {
          recipient: id,
        },
      },
      {
        $facet: {
          messages: [
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
              },
            },
            {
              $unwind: "$sender",
            },
            {
              $lookup: {
                from: "users",
                localField: "recipient",
                foreignField: "_id",
                as: "recipient",
              },
            },
            {
              $unwind: "$recipient",
            },
            {
              $lookup: {
                from: "marketitems",
                localField: "marketItem",
                foreignField: "_id",
                as: "marketItem",
              },
            },
            {
              $unwind: "$marketItem",
            },
            {
              $lookup: {
                from: "products",
                localField: "marketItem.product",
                foreignField: "_id",
                as: "product",
              },
            },
            {
              $unwind: "$product",
            },
            {
              $addFields: {
                "marketItem.productTitle": "$product.title",
              },
            },
            {
              $project: {
                sender: {
                  _id: 1,
                  name: 1,
                  email: 1,
                  image: 1,
                },
                recipient: {
                  _id: 1,
                  name: 1,
                  email: 1,
                },
                marketItem: {
                  _id: 1,
                  title: 1,
                  price: 1,
                  product: {
                    title: "$product.title",
                  },
                },
                phone: 1,
                text: 1,
                read: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
            {
              $sort: {
                read: 1,
                createdAt: -1,
              },
            },
          ],
          unreadCount: [
            {
              $match: {
                read: false,
                recipient: id,
              },
            },
            {
              $count: "total",
            },
          ],
        },
      },
    ]);

    const messages = result[0].messages;
    const unreadCount = result[0].unreadCount[0]?.total || 0;

    return { messages, unreadCount };
  } catch (error) {
    throw new Error("Could not get messages");
  }
}
