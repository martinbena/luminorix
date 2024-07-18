"use server";

import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import { calculateAveragePrice } from "@/db/queries/product";
import {
  removeImageFromCloudinary,
  uploadIamgeToCloudinaryAndGetUrl,
} from "@/lib/async-helpers";
import { formatCurrency } from "@/lib/helpers";
import paths from "@/lib/paths";
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
  location: z.string().regex(/^[A-Za-z\s]+,\s?[A-Za-z\s]+$/, {
    message: "Location must be in the format 'City, Country'",
  }),
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
    location?: string[];
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
  const result = addMarketItemSchema.safeParse({
    product: formData.get("product"),
    price: formData.get("price"),
    age: formData.get("age"),
    condition: formData.get("condition"),
    location: formData.get("location"),
    issues: formData.get("issues"),
    image: formData.get("image"),
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

  let imageUrl: string | undefined;

  try {
    await ConnectDB();

    const { product, price, age, condition, location, issues, image } =
      result.data;

    // LOCATION CHECK
    /////////////////

    const highestAllowedPrice = Math.floor(
      (await calculateAveragePrice(product)) * 0.35
    );

    if (+price > highestAllowedPrice) {
      return {
        errors: {
          price: [
            `Highest allowed price is ${formatCurrency(highestAllowedPrice)}`,
          ],
        },
      };
    }

    imageUrl = await uploadIamgeToCloudinaryAndGetUrl(image);

    const marketItem = new MarketItem({
      product,
      postedBy: session.user._id,
      price: +price,
      age: +age,
      condition,
      location,
      issues,
      image: imageUrl,
    });

    await marketItem.save();

    revalidatePath(paths.marketItemShowAll());
    revalidatePath(paths.userMarketItemShow());
    return {
      errors: {},
      success: true,
    };
  } catch (error: unknown) {
    if (imageUrl) {
      try {
        await removeImageFromCloudinary(imageUrl);
      } catch (removeError) {
        console.error("Error removing image from Cloudinary:", removeError);
      }
    }
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

export async function editMarketItem(
  id: ObjectId,
  formState: MarketItemFormState,
  formData: FormData
): Promise<MarketItemFormState> {
  const result = editMarketItemSchema.safeParse({
    product: formData.get("product"),
    price: formData.get("price"),
    age: formData.get("age"),
    condition: formData.get("condition"),
    location: formData.get("location"),
    issues: formData.get("issues"),
    image: formData.get("image"),
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

  let newImageUrl: string | undefined;

  try {
    await ConnectDB();

    // LOCATION CHECK
    /////////////////

    const editedItem = await MarketItem.findById(id);

    if (!editedItem) {
      return {
        errors: {
          _form: ["Item not found"],
        },
      };
    }

    if (
      session.user._id.toString() !== editedItem.postedBy.toString() &&
      session.user.role !== "admin"
    ) {
      return {
        errors: {
          _form: ["You are not authorized to do this"],
        },
      };
    }

    const { product, price, image } = result.data;

    const highestAllowedPrice = Math.floor(
      (await calculateAveragePrice(product)) * 0.35
    );

    if (+price > highestAllowedPrice) {
      return {
        errors: {
          price: [
            `Highest allowed price is ${formatCurrency(highestAllowedPrice)}`,
          ],
        },
      };
    }

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
    return {
      errors: {},
      success: true,
    };
  } catch (error: unknown) {
    if (newImageUrl) {
      try {
        await removeImageFromCloudinary(newImageUrl);
      } catch (removeError) {
        console.error("Error removing image from Cloudinary:", removeError);
      }
    }
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

export async function deleteMarketItem(
  id: mongoose.Types.ObjectId
): Promise<DeleteItemState> {
  try {
    await ConnectDB();

    const item = await MarketItem.findById(id);

    if (!item) {
      return {
        error: "Market item not found",
      };
    }
    const imageUrl = item.image;

    await MarketItem.findByIdAndDelete(id);

    if (imageUrl) {
      await removeImageFromCloudinary(imageUrl);
    }

    revalidatePath(paths.marketItemShowAll(), "layout");
    revalidatePath(paths.userMarketItemShow());
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
      error: "Market item could not be deleted. Please try again later",
    };
  }
}
