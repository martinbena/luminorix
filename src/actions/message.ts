"use server";

import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import paths from "@/lib/paths";
import MarketItem from "@/models/MarketItem";
import Message from "@/models/Message";
import mongoose, { ObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DeleteItemState } from "./category";
import { getMessages } from "@/db/queries/messages";
import User from "@/models/User";

const sendMessageSchema = z.object({
  telephone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+[1-9]{1}[0-9]{1,3}[0-9\s().-]{7,14}$/.test(val),
      {
        message: "Please enter a correct telephone number with your area code",
      }
    ),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long" })
    .max(2000),
});

interface SendMessageFormState {
  errors: {
    telephone?: string[];
    message?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function sendMessage(
  recipientId: ObjectId,
  marketItemId: ObjectId,
  formState: SendMessageFormState,
  formData: FormData
): Promise<SendMessageFormState> {
  const result = sendMessageSchema.safeParse({
    telephone: formData.get("contact-phone"),
    message: formData.get("message"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You are not authorized to do this"],
      },
    };
  }
  const senderId = session.user._id;
  if (senderId.toString() === recipientId.toString()) {
    return {
      errors: {
        _form: ["You are not allowed to send messages to yourself"],
      },
    };
  }

  try {
    await ConnectDB();

    const marketItem = await MarketItem.findById(marketItemId).exec();
    if (!marketItem) {
      return {
        errors: {
          _form: ["Market item not found"],
        },
      };
    }
    if (marketItem.responders.includes(senderId)) {
      return {
        errors: {
          _form: ["You have already responded to this market item"],
        },
      };
    }

    const { telephone, message } = result.data;

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      marketItem: marketItemId,
      telephone,
      text: message,
    });

    await newMessage.save();

    marketItem.responders.push(senderId);
    await marketItem.save();

    revalidatePath(paths.userMessages());
    revalidatePath(paths.marketItemShow(marketItemId.toString()));
    return {
      errors: {},
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }
}

export async function toggleMessageReadStatus(id: mongoose.Types.ObjectId) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Only logged in users can manage their messages");
  }

  try {
    const message = await Message.findById(id);
    if (!message) throw new Error("Message not found");

    if (session.user._id.toString() !== message.recipient.toString())
      throw new Error("You are not authorized to do this");

    message.read = !message.read;

    await message.save();
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong",
    };
  } finally {
    revalidatePath(paths.userMessages());
  }
}

export async function deleteMessage(
  id: mongoose.Types.ObjectId
): Promise<DeleteItemState> {
  try {
    await ConnectDB();
    await Message.findByIdAndDelete(id);
    revalidatePath(paths.userMessages());
    return {
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return {
      error: "Message could not be deleted. Please try again later",
    };
  }
}
