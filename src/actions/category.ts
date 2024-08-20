"use server";

import { validateUserSession } from "@/auth";
import { handleDataMutation } from "@/lib/handleDataMutation";
import paths from "@/lib/paths";
import { validateFormData } from "@/lib/validateFormData";
import Category from "@/models/Category";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

const baseCategorySchema = z
  .string()
  .min(3, { message: "Category title must be at least 3 characters long" })
  .max(30);

const createCategorySchema = z.object({
  title: baseCategorySchema,
});

const editCategorySchema = z.object({
  editTitle: baseCategorySchema,
});

interface CreateEditCategoryFormState {
  errors: {
    title?: string[];
    editTitle?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function createCategory(
  formState: CreateEditCategoryFormState,
  formData: FormData
): Promise<CreateEditCategoryFormState> {
  const { result, errors } = validateFormData(createCategorySchema, formData);

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

  const mutationResult = await handleDataMutation(async () => {
    const newCategory = new Category({
      title: result.data.title,
      slug: slugify(result.data.title.replace(/'/g, "")),
    });

    await newCategory.save();
    revalidatePath(paths.home(), "layout");
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

export async function editCategory(
  id: mongoose.Types.ObjectId,
  formState: CreateEditCategoryFormState,
  formData: FormData
): Promise<CreateEditCategoryFormState> {
  const { result, errors } = validateFormData(editCategorySchema, formData);

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

  const mutationResult = await handleDataMutation(async () => {
    await Category.findByIdAndUpdate(id, {
      title: result.data.editTitle,
      slug: slugify(result.data.editTitle.replace(/'/g, "")),
    });
    revalidatePath(paths.home(), "layout");
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

export interface DeleteItemState {
  error?: string;
  success?: boolean;
}

export async function deleteCategory(
  id: mongoose.Types.ObjectId
): Promise<DeleteItemState> {
  const mutationResult = await handleDataMutation(async () => {
    await Category.findByIdAndDelete(id);
    revalidatePath("/", "layout");
  });

  return {
    success: mutationResult.success,
  };
}
