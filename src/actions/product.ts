"use server";

import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import paths from "@/lib/paths";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";
import { DeleteItemState } from "./category";
import mongoose from "mongoose";
import {
  removeImageFromCloudinary,
  uploadIamgeToCloudinaryAndGetUrl,
} from "@/lib/helpers";

const productVariantEditSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  price: z.string().min(1, { message: "Please enter price" }),
  previousPrice: z.string().optional(),
  stock: z
    .string()
    .min(1, { message: "Please enter a positive value or zero" }),
});
const productVariantSchema = z.object({
  ...productVariantEditSchema.shape,
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
  sku: z
    .string()
    .min(5, { message: "SKU must be at least 5 characters long" })
    .max(15, { message: "The maximum length of SKU is 15 ccharacters" }),
});

const createSimpleProductSchema = z.object({
  category: z.string().min(1, { message: "Please select a category" }),
  title: z
    .string()
    .min(3, { message: "Product title must be at least 3 characters long" })
    .max(160),
  description: z
    .string()
    .min(50, {
      message: "Product description must be at least 50 characters long",
    })
    .max(2000),
  brand: z.string().min(1, { message: "Please enter brand" }),
  freeShipping: z.preprocess((value) => value === "on", z.boolean()),
});

const createProductSchema = z.object({
  ...createSimpleProductSchema.shape,
  ...productVariantSchema.shape,
});

const editProductWithVariantSchema = z.object({
  ...createProductSchema.shape,
  ...productVariantEditSchema.shape,
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

interface CreateProductFormState {
  errors: {
    category?: string[];
    title?: string[];
    description?: string[];
    brand?: string[];
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

export async function createProduct(
  formState: CreateProductFormState,
  formData: FormData
): Promise<CreateProductFormState> {
  const result = createProductSchema.safeParse({
    category: formData.get("category"),
    title: formData.get("title"),
    description: formData.get("description"),
    brand: formData.get("brand"),
    freeShipping: formData.get("shipping"),
    color: formData.get("color"),
    size: formData.get("size"),
    price: formData.get("price"),
    previousPrice: formData.get("previous-price"),
    image: formData.get("image"),
    stock: formData.get("stock"),
    sku: formData.get("sku"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user || session.user.role !== "admin") {
    return {
      errors: {
        _form: ["You are not authorized to do this"],
      },
    };
  }

  try {
    await ConnectDB();

    const skuCount = await Product.countDocuments({
      "variants.sku": result.data.sku,
    });
    const titleCount = await Product.countDocuments({
      title: result.data.title,
    });
    if (skuCount !== 0 || titleCount !== 0) {
      throw new Error("duplicate key");
    }

    const imageUrl = await uploadIamgeToCloudinaryAndGetUrl(result.data.image);

    const newProduct = new Product({
      category: result.data.category,
      title: result.data.title,
      slug: slugify(result.data.title.replace(/'/g, "")),
      description: result.data.description,
      brand: result.data.brand,
      freeShipping: result.data.freeShipping,
      variants: [
        {
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
      ],
    });

    if (!newProduct && imageUrl) {
      await removeImageFromCloudinary(imageUrl);
    }

    await newProduct.save();

    revalidatePath(paths.home(), "layout");
    return {
      errors: {},
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return {
          errors: {
            _form: ["The product with this title or SKU already exists"],
          },
        };
      }
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

interface EditProductWithVariantFormState {
  errors: {
    category?: string[];
    title?: string[];
    description?: string[];
    brand?: string[];
    color?: string[];
    size?: string[];
    price?: string[];
    previousPrice?: string[];
    stock?: string[];
    image?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function editProductWithVariant(
  id: mongoose.Types.ObjectId,
  sku: string,
  formState: EditProductWithVariantFormState,
  formData: FormData
): Promise<EditProductWithVariantFormState> {
  const result = editProductWithVariantSchema.safeParse({
    category: formData.get("category"),
    title: formData.get("title"),
    description: formData.get("description"),
    brand: formData.get("brand"),
    freeShipping: formData.get("shipping"),
    color: formData.get("color"),
    size: formData.get("size"),
    price: formData.get("price"),
    previousPrice: formData.get("previous-price"),
    image: formData.get("image"),
    stock: formData.get("stock"),
    sku: formData.get("sku"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user || session.user.role !== "admin") {
    return {
      errors: {
        _form: ["You are not authorized to do this"],
      },
    };
  }

  try {
    await ConnectDB();

    const titleCount = await Product.countDocuments({
      title: result.data.title,
      _id: { $ne: id },
    });
    if (titleCount !== 0) {
      throw new Error("duplicate key");
    }

    // The original image url
    const product = await Product.findOne(
      {
        _id: id,
        "variants.sku": sku,
      },
      {
        "variants.$": 1,
      }
    ).exec();

    if (!product || !product.variants.length) {
      return {
        errors: {
          _form: ["Variant not found"],
        },
      };
    }
    const oldImageUrl = product.variants[0].image;

    let newImageUrl;

    if (result.data.image && result.data.image.size > 0) {
      newImageUrl = await uploadIamgeToCloudinaryAndGetUrl(result.data.image);
    }

    const editResult = await Product.updateOne(
      {
        _id: id,
        "variants.sku": sku,
      },
      {
        $set: {
          category: result.data.category,
          title: result.data.title,
          slug: slugify(result.data.title.replace(/'/g, "")),
          description: result.data.description,
          brand: result.data.brand,
          freeShipping: result.data.freeShipping,
          "variants.$.price": +result.data.price,
          "variants.$.previousPrice":
            result.data.previousPrice !== undefined
              ? +result.data.previousPrice
              : undefined,
          "variants.$.color": result.data.color,
          "variants.$.size": result.data.size,
          "variants.$.stock": result.data.stock,
          "variants.$.image":
            result.data.image && result.data.image.size > 0
              ? newImageUrl
              : oldImageUrl,
        },
      }
    ).exec();

    if (
      result.data.image &&
      result.data.image.size > 0 &&
      editResult.modifiedCount !== 0
    ) {
      await removeImageFromCloudinary(oldImageUrl);
    }

    revalidatePath(paths.home(), "layout");
    return {
      errors: {},
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return {
          errors: {
            _form: ["This product already exists"],
          },
        };
      }
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

export async function deleteProduct(
  id: mongoose.Types.ObjectId
): Promise<DeleteItemState> {
  try {
    await ConnectDB();
    await Product.findByIdAndDelete(id);
    revalidatePath("/", "layout");
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
      error: "Product could not be deleted. Please try again later",
    };
  }
}
