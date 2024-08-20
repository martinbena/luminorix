"use server";

import { validateUserSession } from "@/auth";
import { calculateAveragePrice } from "@/db/queries/product";
import {
  removeImageFromCloudinary,
  uploadIamgeToCloudinaryAndGetUrl,
} from "@/lib/async-helpers";
import { handleDataMutation } from "@/lib/handleDataMutation";
import { formatCurrency } from "@/lib/helpers";
import paths from "@/lib/paths";
import { validateFormData } from "@/lib/validateFormData";
import MarketItem from "@/models/MarketItem";
import mongoose, { ObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DeleteItemState } from "./category";

const marketItemSchema = z.object({
  product: z.string().min(1, { message: "Please select a product" }),
  price: z.string().min(1, { message: "Please enter price" }),
  age: z.string().min(1, { message: "Please enter a positive value or zero" }),
  condition: z.string().min(1, { message: "Please select product condition" }),
  issues: z.string().optional(),
});

const addMarketItemSchema = z.object({
  ...marketItemSchema.shape,
  image: z
    .instanceof(File)
    .refine((file) => file.size > 1, "Please pick an image")
    .refine(
      (file) => file.size < 5 * 1024 * 1024,
      "Image size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { message: "Invalid image format. Accepted formats: jpg, jpeg, png" }
    ),
});
const editMarketItemSchema = z.object({
  ...marketItemSchema.shape,
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size < 5 * 1024 * 1024, {
      message: "Image size must be less than 5MB",
    })
    .refine(
      (file) =>
        !file ||
        (file.size === 0 && file.type === "application/octet-stream") ||
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { message: "Invalid image format. Accepted formats: jpg, jpeg, png" }
    ),
});

interface MarketItemFormState {
  errors: {
    product?: string[];
    price?: string[];
    age?: string[];
    condition?: string[];
    issues?: string[];
    image?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function addMarketItem(
  formState: MarketItemFormState,
  formData: FormData
): Promise<MarketItemFormState> {
  const { result, errors } = validateFormData(addMarketItemSchema, formData);

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

  let imageUrl: string | undefined;

  const mutationResult = await handleDataMutation(
    async () => {
      const { product, price, age, condition, issues, image } = result.data;

      const highestAllowedPrice = Math.floor(
        (await calculateAveragePrice(product)) * 0.35
      );

      if (+price > highestAllowedPrice)
        throw new Error(
          `Highest allowed price is ${formatCurrency(highestAllowedPrice)}`
        );

      imageUrl = await uploadIamgeToCloudinaryAndGetUrl(image);

      const marketItem = new MarketItem({
        product,
        postedBy: user?._id,
        price: +price,
        age: +age,
        condition,
        issues,
        image: imageUrl,
      });

      await marketItem.save();

      revalidatePath(paths.marketItemShowAll());
      revalidatePath(paths.userMarketItemShow());
    },
    "Spmething went wrong",
    true,
    imageUrl
  );

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

export async function editMarketItem(
  id: ObjectId,
  formState: MarketItemFormState,
  formData: FormData
): Promise<MarketItemFormState> {
  const { result, errors } = validateFormData(editMarketItemSchema, formData);

  if (!result.success) {
    return {
      errors,
    };
  }

  let newImageUrl: string | undefined;

  const mutationResult = await handleDataMutation(
    async () => {
      const editedItem = await MarketItem.findById(id);

      if (!editedItem) {
        return {
          errors: {
            _form: ["Item not found"],
          },
        };
      }

      const { authorized, authError } = await validateUserSession(
        editedItem.postedBy.toString()
      );

      if (!authorized) throw new Error(authError);

      const { product, price, image } = result.data;

      const highestAllowedPrice = Math.floor(
        (await calculateAveragePrice(product)) * 0.35
      );

      if (+price > highestAllowedPrice)
        throw new Error(
          `Highest allowed price is ${formatCurrency(highestAllowedPrice)}`
        );

      const oldImageUrl = editedItem.image;

      if (image && image.size > 0) {
        newImageUrl = await uploadIamgeToCloudinaryAndGetUrl(image);
      }

      const updateData = {
        ...result.data,
        image: image && image.size > 0 ? newImageUrl : oldImageUrl,
      };

      const editResult = await MarketItem.findByIdAndUpdate(id, updateData);

      if (image && image.size > 0 && editResult.modifiedCount !== 0) {
        await removeImageFromCloudinary(oldImageUrl);
      }

      revalidatePath(paths.marketItemShowAll());
      revalidatePath(paths.userMarketItemShow());
    },
    "Market item could not be edited",
    true,
    newImageUrl
  );

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

export async function deleteMarketItem(
  id: mongoose.Types.ObjectId
): Promise<DeleteItemState> {
  const mutationResult = await handleDataMutation(
    async () => {
      const item = await MarketItem.findById(id);

      if (!item) throw new Error("Market item not found");

      const { authorized, authError } = await validateUserSession(
        item.postedBy.toString()
      );
      if (!authorized) throw new Error(authError);

      const imageUrl = item.image;

      await MarketItem.findByIdAndDelete(id);

      if (imageUrl) {
        await removeImageFromCloudinary(imageUrl);
      }

      revalidatePath(paths.marketItemShowAll(), "layout");
      revalidatePath(paths.userMarketItemShow());
    },
    "Market item could not be deleted. Please try again later",
    false
  );

  return {
    success: mutationResult.success,
  };
}
