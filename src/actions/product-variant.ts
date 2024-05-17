"use server";

import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import cloudinary from "@/lib/cloudinary";
import paths from "@/lib/paths";
import Product, { Variant as VariantType } from "@/models/Product";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
// import { DeleteItemState } from "./category";

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
  const result = createVariantSchema.safeParse({
    product: formData.get("product"),
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

    if (skuCount !== 0) {
      throw new Error("duplicate key - SKU");
    }

    ///////// Upload Image ////////////
    const imageBuffer = await result.data.image.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);

    const imageBase64 = imageData.toString("base64");

    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      { folder: "luminorix" }
    );
    //////////////////////////////////

    const variantResult = await Product.findByIdAndUpdate(result.data.product, {
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
          image: uploadResult.secure_url,
        },
      },
    });

    if (!variantResult && uploadResult) {
      const imageUrlParts = uploadResult.secure_url.split("/");
      const imagePublicId = imageUrlParts?.at(-1)?.split(".").at(0);
      await cloudinary.uploader.destroy("luminorix/" + imagePublicId);
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
            _form: ["Variant with this SKU already exists"],
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

interface DeleteItemState {
  error?: string;
  success?: boolean;
}

export async function removeVariantFromProduct(
  id: mongoose.Types.ObjectId,
  sku: string
): Promise<DeleteItemState> {
  try {
    await ConnectDB();

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

    if (!result) {
      throw new Error("Failed to remove the variant from the product");
    }

    ////////// Delete image from cloudinary //////////

    const variant = product.variants.find((v: VariantType) => v.sku === sku);

    const imageUrlParts = variant.image.split("/");
    const imagePublicId = imageUrlParts.at(-1).split(".").at(0);

    if (imagePublicId) {
      await cloudinary.uploader.destroy("luminorix/" + imagePublicId);
    }
    //////////////////////////////////////////////////

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
      error: "Product variant could not be deleted. Please try again later",
    };
  }
}
