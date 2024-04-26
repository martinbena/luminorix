"use server";

import * as auth from "@/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const signInUserSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: "Please enter a correct e-mail address",
  }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" }),
});

interface SignInWithCredentialsFormState {
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
}

export async function signInWithCredentials(
  formState: SignInWithCredentialsFormState,
  formData: FormData
): Promise<SignInWithCredentialsFormState> {
  const result = signInUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await auth.signIn("credentials", {
      redirect: false,
      email: result.data.email,
      password: result.data.password,
    });
  } catch (error: any) {
    return {
      errors: {
        _form: ["Invalid e-mail or password"],
      },
    };
  }

  redirect("/");
}
