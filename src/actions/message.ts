"use server";

import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import paths from "@/lib/paths";
import MarketItem from "@/models/MarketItem";
import Message from "@/models/Messages";
import { ObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
      body: message,
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
