"use server";

import { hashPassword } from "@/lib/brcypt";
import { handleDataMutation } from "@/lib/handleDataMutation";
import { transporter } from "@/lib/nodemailerTransporter";
import { validateFormData } from "@/lib/validateFormData";
import User from "@/models/User";
import randomInteger from "random-int";
import { z } from "zod";

const generateResetCodeSchema = z
  .object({
    email: z
      .string()
      .max(50)
      .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
        message: "Please enter a correct e-mail address",
      }),
    emailConfirm: z.string(),
  })
  .refine((data) => data.email === data.emailConfirm, {
    message: "E-mail addresses do not match",
    path: ["emailConfirm"],
  });

const createNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

interface GenerateResetCodeFormState {
  errors: {
    email?: string[];
    emailConfirm?: string[];
    _form?: string[];
  };
  success?: boolean;
  email?: string;
}

export async function generateResetCode(
  formState: GenerateResetCodeFormState,
  formData: FormData
): Promise<GenerateResetCodeFormState> {
  const { result, errors } = validateFormData(
    generateResetCodeSchema,
    formData
  );

  if (!result.success) {
    return {
      errors,
    };
  }

  if (result.data.email.includes("@gmail.com")) {
    return {
      errors: {
        _form: ["You are not allowed to use this service as a Gmail user"],
      },
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const user = await User.findOne({ email: result.data.email });

    if (!user) throw new Error("There is no user with this e-mail address");

    const resetCode = randomInteger(100000, 999999);

    user.resetCode = {
      data: resetCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    await user.save();

    const mailOptions = {
      to: result.data.email,
      from: process.env.GMAIL_AUTH_USER,
      subject: "Password Reset Code",
      html: `
        Hi ${user.name},<br />
        <br />
        You have requested a password reset. Please use the following
        code to reset your password:<br />
        <br />
        <strong>${resetCode}</strong><br />
        <br />
        If you did not request a password reset, please ignore this
        email.<br />
        <br />
        <br />
        Thanks,<br /><br />
        The Luminorix Team
        `,
    };

    await transporter.sendMail(mailOptions);
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
    email: result.data.email,
  };
}

interface EnterResetCodeFormState {
  errors: {
    _form?: string[];
  };
  success?: boolean;
}

export async function enterResetCode(
  email: string | undefined,
  resetCode: string,
  formState: EnterResetCodeFormState,
  formData: FormData
): Promise<EnterResetCodeFormState> {
  if (!email) {
    return {
      errors: {
        _form: ["Please provide your e-mail address on previous step"],
      },
    };
  }
  if (email.includes("@gmail.com")) {
    return {
      errors: {
        _form: ["You are not allowed to use this service as a Gmail user"],
      },
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const user = await User.findOne({
      email,
      "resetCode.data": resetCode,
      "resetCode.expiresAt": { $gt: new Date() },
    });

    if (!user) throw new Error("Invalid or expired reset code");
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}

interface createNewPasswordFormState {
  errors: {
    password?: string[];
    passwordConfirm?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function createNewPassword(
  email: string | undefined,
  resetCode: string,
  formState: createNewPasswordFormState,
  formData: FormData
): Promise<createNewPasswordFormState> {
  const { result, errors } = validateFormData(
    createNewPasswordSchema,
    formData
  );

  if (!result.success) {
    return {
      errors,
    };
  }

  if (!email) {
    return {
      errors: {
        _form: ["Please provide your e-mail address on previous step"],
      },
    };
  }

  if (email.includes("@gmail.com")) {
    return {
      errors: {
        _form: ["You are not allowed to use this service as a Gmail user"],
      },
    };
  }

  const mutationResult = await handleDataMutation(async () => {
    const user = await User.findOne({
      email,
      "resetCode.data": resetCode,
      "resetCode.expiresAt": { $gt: new Date() },
    });

    if (!user) throw new Error("Invalid or expired reset code");

    user.password = await hashPassword(result.data.password);
    user.resetCode = null;

    await user.save();
  });

  return {
    errors: mutationResult.errors || {},
    success: mutationResult.success,
  };
}
