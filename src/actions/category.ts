"use server";

import { auth } from "@/auth";
import ConnectDB from "@/lib/connectDB";
import Category from "@/models/Category";
import slugify from "slugify";
import { z } from "zod";

const createCategorySchema = z.object({
  title: z
    .string()
    .min(3, { message: "Category title must be at least 3 characters long" }),
});

interface CreateCategoryFormState {
  errors: {
    title?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function createCategory(
  formState: CreateCategoryFormState,
  formData: FormData
): Promise<CreateCategoryFormState> {
  const result = createCategorySchema.safeParse({
    title: formData.get("title"),
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

    const newCategory = new Category({
      title: result.data.title,
      slug: slugify(result.data.title.replace(/'/g, "")),
    });

    await newCategory.save();

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
