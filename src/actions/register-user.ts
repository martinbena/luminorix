"use server";

import { hashPassword } from "@/lib/brcypt";
import ConnectDB from "@/db/connectDB";
import User from "@/models/User";
import { z } from "zod";

const registerUserSchema = z
  .object({
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
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

interface RegisterUserFormState {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function registerUser(
  formState: RegisterUserFormState,
  formData: FormData
): Promise<RegisterUserFormState> {
  const result = registerUserSchema.safeParse({
    name: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await ConnectDB();

    const existingUser = await User.findOne({ email: result.data.email });

    if (existingUser) {
      return {
        errors: {
          _form: ["User with this e-mail address already exists"],
        },
      };
    }

    const hashedPassword = await hashPassword(result.data.password);

    const registeredUser = new User({
      name: result.data.name,
      email: result.data.email,
      password: hashedPassword,
    });

    await registeredUser.save();

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
