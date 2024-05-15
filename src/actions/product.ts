"use server";

import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import paths from "@/lib/paths";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

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

const createProductSchema = z.object({
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
  ...productVariantSchema.shape,
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
        },
      ],
    });

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
