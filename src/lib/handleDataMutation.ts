import ConnectDB from "@/db/connectDB";
import { removeImageFromCloudinary } from "./async-helpers";
import { isRedirectError } from "next/dist/client/components/redirect";
import { AuthError } from "@auth/core/errors";

type MutationResult<T> = {
  errors?: Record<string, string[]>;
  error?: string;
  success?: boolean;
  data?: T;
};

export async function handleDataMutation<T>(
  mutationFn: () => Promise<T>,
  errorMessage = "Something went wrong",
  isInForm = true,
  imageUrl: string | undefined = undefined
): Promise<MutationResult<T>> {
  try {
    await ConnectDB();
    const data = await mutationFn();
    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (imageUrl) {
      try {
        await removeImageFromCloudinary(imageUrl);
      } catch (removeError) {
        console.error("Error removing image from Cloudinary:", removeError);
      }
    }
    if (!isInForm) {
      return {
        error: errorMessage,
      };
    }
    if (error instanceof Error) {
      const { message } = error as AuthError;

      if (
        message === "CallbackRouteError" ||
        message.toLowerCase().startsWith("a") ||
        message.toLowerCase().startsWith("o") ||
        message.toLowerCase().startsWith("y")
      ) {
        return {
          errors: {
            _form: ["Invalid e-mail or password"],
          },
        };
      }
      if (error.message.includes("duplicate key")) {
        return {
          errors: {
            _form: ["This record already exists"],
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
          _form: [errorMessage],
        },
      };
    }
  }
}
