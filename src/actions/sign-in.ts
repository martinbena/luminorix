"use server";

import * as auth from "@/auth";
import paths from "@/lib/paths";
import { z } from "zod";
import { AuthError } from "@auth/core/errors";
import { isRedirectError } from "next/dist/client/components/redirect";

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
      email: result.data.email,
      password: result.data.password,
      redirectTo: paths.home(),
    });
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof Error) {
      const { message } = error as AuthError;

      if (
        message === "CallbackRouteError" ||
        message.toLowerCase().startsWith("a") ||
        message.toLowerCase().startsWith("o")
      ) {
        return {
          errors: {
            _form: ["Invalid e-mail or password"],
          },
        };
      }

      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }

  return {
    errors: {},
  };
}

export async function signInWithGoogle() {
  return auth.signIn("google");
}
