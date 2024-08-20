"use server";

import { validateUserSession } from "@/auth";
import {
  removeImageFromCloudinary,
  uploadIamgeToCloudinaryAndGetUrl,
} from "@/lib/async-helpers";
import { hashPassword, verifyPassword } from "@/lib/brcypt";
import { handleDataMutation } from "@/lib/handleDataMutation";
import paths from "@/lib/paths";
import { validateFormData } from "@/lib/validateFormData";
import User, { User as UserType } from "@/models/User";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const editAccountSchema = z.object({
  name: z
    .string()
    .max(50)
    // @ts-ignore
    .regex(/^[\p{L}'’\-]{2,}(?:\s[\p{L}'’\-]{2,})+$/u, {
      message: "Please enter a correct full name",
    }),
  email: z
    .string()
    .max(50)
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
      message: "Please enter a correct e-mail address",
    }),
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

const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, { message: "Please provide your current password" }),
    newPassword: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" }),
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "New passwords do not match",
    path: ["newPasswordConfirm"],
  });

interface EditAccountFormState {
  errors: {
    name?: string[];
    email?: string[];
    image?: string[];
    _form?: string[];
  };
  success?: boolean;
  updatedUser?: {
    name: string;
    email: string;
    image: string | undefined;
  };
}

export async function editAccount(
  id: string | undefined,
  formState: EditAccountFormState,
  formData: FormData
): Promise<EditAccountFormState> {
  const { result, errors } = validateFormData(editAccountSchema, formData);

  if (!result.success) {
    return {
      errors,
    };
  }

  if (result.data.email.includes("@gmail.com")) {
    return {
      errors: {
        _form: ["To use Gmail, please sign in with Google"],
      },
    };
  }

  let newImageUrl: string | undefined;

  const mutationResult = await handleDataMutation(
    async () => {
      const user: UserType | null = await User.findById(id);

      if (!user) throw new Error("User not found");

      const { name, email, image } = result.data;

      if (user?.email.includes("@gmail.com")) {
        return {
          errors: {
            _form: ["Please make the changes in your Google account"],
          },
        };
      }

      const { authorized, authError } = await validateUserSession(
        user?._id.toString()
      );

      if (!authorized) throw new Error(authError);

      const oldImageUrl = user.image ?? "";

      if (image && image.size > 0) {
        newImageUrl = await uploadIamgeToCloudinaryAndGetUrl(image);
      }

      user.name = result.data.name;
      user.email = result.data.email;
      user.image = image && image.size > 0 ? newImageUrl : oldImageUrl;

      await user.save();

      if (
        image &&
        image.size > 0 &&
        newImageUrl !== oldImageUrl &&
        oldImageUrl.length
      ) {
        await removeImageFromCloudinary(oldImageUrl);
      }

      revalidatePath(paths.home(), "layout");
      revalidatePath(paths.userProfile(), "layout");
      return {
        updatedUser: {
          name,
          email,
          image: image && image.size > 0 ? newImageUrl : oldImageUrl,
        },
      };
    },
    "Something went wrong",
    true,
    newImageUrl
  );

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
    updatedUser: mutationResult.data?.updatedUser,
  };
}

interface ChangePasswordFormState {
  errors: {
    oldPassword?: string[];
    newPassword?: string[];
    newPasswordConfirm?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function changePassword(
  id: string | undefined,
  formState: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const { result, errors } = validateFormData(changePasswordSchema, formData);

  if (!result.success) {
    return {
      errors,
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const user: UserType | null = await User.findById(id);

    if (!user) throw new Error("User not found");

    if (user?.email.includes("@gmail.com")) {
      return {
        errors: {
          _form: ["Please make the changes in your Google account"],
        },
      };
    }

    const { authorized, authError } = await validateUserSession(
      user?._id.toString()
    );

    if (!authorized) throw new Error(authError);

    const isPasswordValid = await verifyPassword(
      result.data.oldPassword,
      user.password
    );

    if (!isPasswordValid) throw new Error("Incorrect current password");

    const newHashedPassword = await hashPassword(result.data.newPassword);

    user.password = newHashedPassword;

    await user.save();
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}
