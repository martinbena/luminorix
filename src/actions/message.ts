"use server";

import { validateUserSession } from "@/auth";
import { handleDataMutation } from "@/lib/handleDataMutation";
import paths from "@/lib/paths";
import { validateFormData } from "@/lib/validateFormData";
import MarketItem from "@/models/MarketItem";
import Message from "@/models/Message";
import mongoose, { ObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DeleteItemState } from "./category";

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
  const { result, errors } = validateFormData(sendMessageSchema, formData);

  if (!result.success) {
    return {
      errors,
    };
  }

  const { authenticated, authError, user } = await validateUserSession();

  if (!authenticated) {
    return {
      errors: {
        _form: [authError],
      },
    };
  }
  const senderId = user?._id;
  if (senderId?.toString() === recipientId.toString()) {
    console.log("haha");
    return {
      errors: {
        _form: ["You are not allowed to send messages to yourself"],
      },
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const marketItem = await MarketItem.findById(marketItemId).exec();
    if (!marketItem) throw new Error("Market item not found");
    if (marketItem.responders.includes(senderId))
      throw new Error("You have already responded to this market item");

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
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

export async function toggleMessageReadStatus(id: mongoose.Types.ObjectId) {
  await handleDataMutation(
    async () => {
      const message = await Message.findById(id);
      if (!message) throw new Error("Message not found");

      const { authorized, authError } = await validateUserSession(
        message.recipient.toString()
      );
      if (!authorized) throw new Error(authError);

      message.read = !message.read;

      await message.save();
    },
    "Something went wrong",
    false
  );

  revalidatePath(paths.userReviews());
}

export async function deleteMessage(
  id: mongoose.Types.ObjectId
): Promise<DeleteItemState> {
  const mutationResult = await handleDataMutation(
    async () => {
      const message = await Message.findById(id);
      const { authorized, authError } = await validateUserSession(
        message.recipient.toString()
      );
      if (!authorized) throw new Error(authError);
      await Message.findByIdAndDelete(id);
    },
    "Message could not be deleted. Please try again later",
    false
  );

  revalidatePath(paths.userReviews());

  return {
    error: mutationResult.error || "",
    success: mutationResult.success,
  };
}
