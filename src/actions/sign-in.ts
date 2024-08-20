"use server";

import * as auth from "@/auth";
import { handleDataMutation } from "@/lib/handleDataMutation";
import paths from "@/lib/paths";
import { validateFormData } from "@/lib/validateFormData";
import { z } from "zod";

const signInUserSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: "Please enter a correct e-mail address",
  }),
  password: z.string().min(1, { message: "Password is required" }),
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
  const { result, errors } = validateFormData(signInUserSchema, formData);

  if (!result.success) {
    return {
      errors,
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    await auth.signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirectTo: paths.home(),
    });
  });

  return {
    errors: mutationResult.errors || {},
  };
}

export async function signInWithGoogle() {
  return auth.signIn("google");
}
