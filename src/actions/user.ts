"use server";

import { auth } from "@/auth";
import ConnectDB from "@/db/connectDB";
import {
  removeImageFromCloudinary,
  uploadIamgeToCloudinaryAndGetUrl,
} from "@/lib/async-helpers";
import { hashPassword, verifyPassword } from "@/lib/brcypt";
import paths from "@/lib/paths";
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
  const result = editAccountSchema.safeParse({
    name: formData.get("edit-fullName"),
    email: formData.get("edit-email"),
    image: formData.get("edit-image"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  if (result.data.email.includes("@gmail.com")) {
    return {
      errors: {
        _form: ["To use Gmail, please sign in with Google"],
      },
    };
  }

  let newImageUrl;

  try {
    await ConnectDB();

    const session = await auth();
    const user: UserType | null = await User.findById(id);
    const { name, email, image } = result.data;

    if (user?.email.includes("@gmail.com")) {
      return {
        errors: {
          _form: ["Please make the changes in your Google account"],
        },
      };
    }

    if (
      !session ||
      !session.user ||
      session.user._id !== user?._id.toString()
    ) {
      return {
        errors: {
          _form: ["You are not authorized to do this"],
        },
      };
    }

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
      errors: {},
      success: true,
      updatedUser: {
        name,
        email,
        image: image && image.size > 0 ? newImageUrl : oldImageUrl,
      },
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
      if (error.message.includes("duplicate key")) {
        return {
          errors: {
            _form: ["The user with this e-mail address already exists"],
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
  const result = changePasswordSchema.safeParse({
    oldPassword: formData.get("old-password"),
    newPassword: formData.get("new-password"),
    newPasswordConfirm: formData.get("new-password-confirm"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await ConnectDB();

    const session = await auth();
    const user: UserType | null = await User.findById(id);

    if (user?.email.includes("@gmail.com")) {
      return {
        errors: {
          _form: ["Please make the changes in your Google account"],
        },
      };
    }

    if (
      !session ||
      !session.user ||
      session.user._id !== user?._id.toString()
    ) {
      return {
        errors: {
          _form: ["You are not authorized to do this"],
        },
      };
    }

    const isPasswordValid = await verifyPassword(
      result.data.oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      return {
        errors: {
          oldPassword: ["Incorrect current password"],
        },
      };
    }

    const newHashedPassword = await hashPassword(result.data.newPassword);

    user.password = newHashedPassword;

    await user.save();

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
