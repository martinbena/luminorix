"use server";

import ConnectDB from "@/db/connectDB";
import Newsletter from "@/models/Newsletter";
import { z } from "zod";

const newsletterSubscribeSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: "Please enter a correct e-mail address",
  }),
});

interface NewsletterFormState {
  errors: {
    email?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function newsletterSubscribe(
  formState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const result = newsletterSubscribeSchema.safeParse({
    email: formData.get("newsletter-email"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await ConnectDB();

    const existingNewsletter = await Newsletter.findOne({
      email: result.data.email,
    });

    if (existingNewsletter) {
      return {
        errors: {
          email: ["The subscription for this e-mail address already exists"],
        },
      };
    }

    await Newsletter.create({ email: result.data.email });

    return {
      errors: {},
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error?.message],
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
