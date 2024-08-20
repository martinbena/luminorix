"use server";

import { handleDataMutation } from "@/lib/handleDataMutation";
import { validateFormData } from "@/lib/validateFormData";
import Newsletter from "@/models/Newsletter";
import { z } from "zod";

const newsletterSubscribeSchema = z.object({
  newsletterEmail: z
    .string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
      message: "Please enter a correct e-mail address",
    }),
});

interface NewsletterFormState {
  errors: {
    newsletterEmail?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function newsletterSubscribe(
  formState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const { result, errors } = validateFormData(
    newsletterSubscribeSchema,
    formData
  );

  if (!result.success) {
    return {
      errors,
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const existingNewsletter = await Newsletter.findOne({
      email: result.data.newsletterEmail,
    });

    if (existingNewsletter)
      throw new Error(
        "The subscription for this e-mail address already exists"
      );

    await Newsletter.create({ email: result.data.newsletterEmail });
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}
