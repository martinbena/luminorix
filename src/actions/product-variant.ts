"use server";

import { validateUserSession } from "@/auth";
import {
  removeImageFromCloudinary,
  uploadIamgeToCloudinaryAndGetUrl,
} from "@/lib/async-helpers";
import { handleDataMutation } from "@/lib/handleDataMutation";
import paths from "@/lib/paths";
import { validateFormData } from "@/lib/validateFormData";
import Product, { Variant as VariantType } from "@/models/Product";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DeleteItemState } from "./category";

const productVariantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  price: z.string().min(1, { message: "Please enter price" }),
  previousPrice: z.string().optional(),
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
  stock: z
    .string()
    .min(1, { message: "Please enter a positive value or zero" }),
  sku: z
    .string()
    .min(5, { message: "SKU must be at least 5 characters long" })
    .max(15, { message: "The maximum length of SKU is 15 ccharacters" }),
});

const createVariantSchema = z.object({
  product: z.string().min(1, { message: "Please select a product" }),
  ...productVariantSchema.shape,
});

interface CreateVariantFormState {
  errors: {
    product?: string[];
    color?: string[];
    size?: string[];
    price?: string[];
    previousPrice?: string[];
    image?: string[];
    stock?: string[];
    sku?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function addVariantToProduct(
  formState: CreateVariantFormState,
  formData: FormData
): Promise<CreateVariantFormState> {
  const { result, errors } = validateFormData(createVariantSchema, formData);

  if (!result.success) {
    return {
      errors,
    };
  }

  const { authorized, authError } = await validateUserSession();

  if (!authorized) {
    return {
      errors: {
        _form: [authError],
      },
    };
  }

  let imageUrl;

  const mutationResult = await handleDataMutation(
    async () => {
      const skuCount = await Product.countDocuments({
        "variants.sku": result.data.sku,
      });

      if (skuCount !== 0) throw new Error("duplicate key - SKU");

      imageUrl = await uploadIamgeToCloudinaryAndGetUrl(result.data.image);

      const variantResult = await Product.findByIdAndUpdate(
        result.data.product,
        {
          $push: {
            variants: {
              sku: result.data.sku,
              price: +result.data.price,
              previousPrice:
                result.data.previousPrice !== undefined &&
                +result.data.previousPrice,
              color: result.data.color,
              size: result.data.size,
              stock: result.data.stock,
              image: imageUrl,
            },
          },
        }
      );

      if (!variantResult && imageUrl) {
        await removeImageFromCloudinary(imageUrl);
      }

      revalidatePath(paths.home(), "layout");
    },
    "Something went wrong",
    true,
    imageUrl
  );

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

export async function removeVariantFromProduct(
  id: mongoose.Types.ObjectId,
  sku: string
): Promise<DeleteItemState> {
  const { authorized, authError } = await validateUserSession();

  if (!authorized) {
    return {
      error: authError,
    };
  }

  const mutationResult = await handleDataMutation(
    async () => {
      const product = await Product.findById(id);
      const isLastVariant = product.variants.length === 1;

      let result;
      if (isLastVariant) {
        result = await Product.findByIdAndDelete(id);
      }

      if (!isLastVariant) {
        result = await Product.findByIdAndUpdate(id, {
          $pull: {
            variants: {
              sku,
            },
          },
        });
      }

      if (!result) throw new Error("Failed to remove variant from the product");

      const variant = product.variants.find((v: VariantType) => v.sku === sku);
      await removeImageFromCloudinary(variant.image);

      revalidatePath(paths.home(), "layout");
    },
    "Product variant could not be deleted. Please try again later",
    false
  );

  return {
    error: mutationResult.error || "",
    success: mutationResult.success,
  };
}
