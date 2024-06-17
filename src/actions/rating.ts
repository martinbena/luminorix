"use server";

import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import Product, { Rating } from "@/models/Product";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
