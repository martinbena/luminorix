"use server";

import { hashPassword } from "@/lib/brcypt";
import { handleDataMutation } from "@/lib/handleDataMutation";
import { validateFormData } from "@/lib/validateFormData";
import User from "@/models/User";
import { z } from "zod";

const registerUserSchema = z
  .object({
    fullName: z
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
    fullName?: string[];
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
  const { result, errors } = validateFormData(registerUserSchema, formData);

  if (!result.success) {
    return {
      errors,
    };
  }

  if (result.data.email.includes("@gmail.com")) {
    return {
      errors: {
        _form: ["To use Gmail, please login with Google"],
      },
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const existingUser = await User.findOne({ email: result.data.email });

    if (existingUser)
      throw new Error("User with this e-mail address already exists");

    const hashedPassword = await hashPassword(result.data.password);

    const registeredUser = new User({
      name: result.data.fullName,
      email: result.data.email,
      password: hashedPassword,
    });

    await registeredUser.save();
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}
