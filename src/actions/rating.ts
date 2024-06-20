"use server";

import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import Product, { Rating } from "@/models/Product";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DeleteItemState } from "./category";
import paths from "@/lib/paths";

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
  const result = productRatingSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment"),
    productSlug: formData.get("product-slug"),
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
        _form: [
          "Only logged in users who purchased the product may leave a review",
        ],
      },
    };
  }

  const user = session.user._id;

  try {
    await ConnectDB();

    const product = await Product.findOne({ slug: result.data.productSlug })
      .populate("ratings")
      .exec();

    const existingRating = product.ratings.find(
      (rating: Rating) => rating.postedBy.toString() === user.toString()
    );

    if (existingRating) {
      return {
        errors: {
          _form: [
            "You have already rated this product. You can visit you profile for edit",
          ],
        },
      };
    }

    // const userPurchased = await Order.findOne({
    //   userId: token.user._id,
    //   "cartItems._id": productId,
    // });

    // if (userPurchased) {
    //   return {
    //     errors: {
    //       _form: ["You can only leave rating for products you have purchased"],
    //     },
    //   };
    // }

    product.ratings.push({
      rating: result.data.rating,
      comment: result.data.comment,
      postedBy: user,
    });
    await product.save();

    revalidatePath(`/${result.data.productSlug}`, "layout");
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

export async function editRating(
  formState: AddRatingFormState,
  formData: FormData
): Promise<AddRatingFormState> {
  const result = productRatingSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment"),
    productSlug: formData.get("product-slug"),
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
        _form: ["Only logged in users may edit a review"],
      },
    };
  }

  const user = session.user._id;

  try {
    await ConnectDB();

    const editResult = await Product.updateOne(
      { slug: result.data.productSlug, "ratings.postedBy": user },
      {
        $set: {
          "ratings.$.rating": result.data.rating,
          "ratings.$.comment": result.data.comment,
          "ratings.$.updatedAt": new Date(),
        },
      }
    );

    if (!editResult) {
      return {
        errors: {
          _form: ["Could not edit rating"],
        },
      };
    }

    revalidatePath(`/${result.data.productSlug}`, "layout");
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
  } finally {
    revalidatePath(paths.userReviews());
  }
}

export async function deleteRating(
  productSlug: string,
  userId: string
): Promise<DeleteItemState> {
  try {
    await ConnectDB();
    const result = await Product.updateOne(
      { slug: productSlug },
      { $pull: { ratings: { postedBy: new mongoose.Types.ObjectId(userId) } } }
    );

    if (!result) {
      return {
        error: "Could not remove rating",
      };
    }

    revalidatePath(`/${productSlug}`, "layout");
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
      error: "Rating could not be deleted. Please try again later",
    };
  } finally {
    revalidatePath(paths.userReviews());
  }
}
