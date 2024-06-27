"use server";

import { z } from "zod";

const checkContactDetailsSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: "Please enter a correct e-mail address",
  }),
  telephone: z.string().regex(/^\+[1-9]{1}[0-9]{1,3}[0-9\s().-]{7,14}$/, {
    message: "Please enter a correct telephone number with your area code",
  }),
});

interface CheckContactDetailsFormState {
  errors: {
    email?: string[];
    telephone?: string[];
    _form?: string[];
  };
  success?: boolean;
  data?: {
    email: string;
    telephone: string;
  };
}

export async function checkContactDetails(
  formState: CheckContactDetailsFormState,
  formData: FormData
): Promise<CheckContactDetailsFormState> {
  const result = checkContactDetailsSchema.safeParse({
    email: formData.get("email"),
    telephone: formData.get("telephone"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    errors: {},
    success: true,
    data: {
      email: result.data.email,
      telephone: result.data.telephone,
    },
  };
}
