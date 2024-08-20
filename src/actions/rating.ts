"use server";

import { validateUserSession } from "@/auth";
import { handleDataMutation } from "@/lib/handleDataMutation";
import paths from "@/lib/paths";
import { validateFormData } from "@/lib/validateFormData";
import Order from "@/models/Order";
import Product, { Rating } from "@/models/Product";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DeleteItemState } from "./category";

const productRatingSchema = z.object({
  rating: z.preprocess(
    (value) => {
      const parsedValue = parseInt(value as string, 10);
      return isNaN(parsedValue) ? undefined : parsedValue;
    },
    z
      .number({
        required_error: "Please enter a rating between 1 and 5",
        invalid_type_error: "Rating must be a number between 1 and 5",
      })
      .min(1, { message: "Rating must be a number between 1 and 5" })
      .max(5, { message: "Rating must be a number between 1 and 5" })
  ),
  comment: z.string().max(200, {
    message: "Review can be a maximum of 200 characters long",
  }),
  productSlug: z.string().min(1, { message: "Product identifier is required" }),
});

interface AddRatingFormState {
  errors: {
    rating?: string[];
    comment?: string[];
    productSlug?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function addRating(
  formState: AddRatingFormState,
  formData: FormData
): Promise<AddRatingFormState> {
  const { result, errors } = validateFormData(productRatingSchema, formData);

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
  const userId = user?._id;

  const mutationResult = await handleDataMutation(async () => {
    const product = await Product.findOne({ slug: result.data.productSlug })
      .populate("ratings")
      .exec();

    const existingRating = product.ratings.find(
      (rating: Rating) => rating.postedBy.toString() === userId?.toString()
    );

    if (existingRating)
      throw new Error(
        "You have already rated this product. You can visit you profile for edit"
      );

    const userPurchased = await Order.findOne({
      userId: new mongoose.Types.ObjectId(userId?.toString()),
      "cartItems._id": product._id,
      delivery_status: "Delivered",
    });

    if (!userPurchased)
      throw new Error(
        "You can only leave rating for products you have purchased and got delivered"
      );

    product.ratings.push({
      rating: result.data.rating,
      comment: result.data.comment,
      postedBy: userId,
    });
    await product.save();

    revalidatePath(`/${result.data.productSlug}`, "layout");
    revalidatePath(paths.userProfile());
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

export async function editRating(
  formState: AddRatingFormState,
  formData: FormData
): Promise<AddRatingFormState> {
  const { result, errors } = validateFormData(productRatingSchema, formData);

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

  const userId = user?._id;

  const mutationResult = await handleDataMutation(async () => {
    const editResult = await Product.updateOne(
      { slug: result.data.productSlug, "ratings.postedBy": userId },
      {
        $set: {
          "ratings.$.rating": result.data.rating,
          "ratings.$.comment": result.data.comment,
          "ratings.$.updatedAt": new Date(),
        },
      }
    );

    if (!editResult) throw new Error("Could not edit rating");

    revalidatePath(`/${result.data.productSlug}`, "layout");
  });

  revalidatePath(paths.userReviews());

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

export async function deleteRating(
  productSlug: string,
  userId: string
): Promise<DeleteItemState> {
  const mutationResult = await handleDataMutation(
    async () => {
      const result = await Product.updateOne(
        { slug: productSlug },
        {
          $pull: { ratings: { postedBy: new mongoose.Types.ObjectId(userId) } },
        }
      );

      if (!result) throw new Error("Could not remove rating");

      revalidatePath(`/${productSlug}`, "layout");
    },
    "Rating could not be deleted. Please try again later",
    false
  );

  revalidatePath(paths.userReviews());

  return {
    error: mutationResult.error || "",
    success: mutationResult.success,
  };
}
