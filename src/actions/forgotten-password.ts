"use server";

import { hashPassword } from "@/lib/brcypt";
import ConnectDB from "@/db/connectDB";
import User from "@/models/User";
import { z } from "zod";
import randomInteger from "random-int";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_AUTH_USER,
    pass: process.env.GMAIL_AUTH_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

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
  const result = generateResetCodeSchema.safeParse({
    email: formData.get("email"),
    emailConfirm: formData.get("email-confirm"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  if (result.data.email.includes("@gmail.com")) {
    return {
      errors: {
        _form: ["You are not allowed to use this service as a Gmail user"],
      },
    };
  }

  try {
    await ConnectDB();

    const user = await User.findOne({ email: result.data.email });

    if (!user) {
      return {
        errors: {
          _form: ["There is no user with this e-mail address"],
        },
      };
    }

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

    return {
      errors: {},
      success: true,
      email: result.data.email,
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

  try {
    await ConnectDB();

    const user = await User.findOne({
      email,
      "resetCode.data": resetCode,
      "resetCode.expiresAt": { $gt: new Date() },
    });

    if (!user) {
      return {
        errors: {
          _form: ["Invalid or expired reset code"],
        },
      };
    }

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
  const result = createNewPasswordSchema.safeParse({
    password: formData.get("password"),
    passwordConfirm: formData.get("password-confirm"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
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

  try {
    await ConnectDB();

    const user = await User.findOne({
      email,
      "resetCode.data": resetCode,
      "resetCode.expiresAt": { $gt: new Date() },
    });

    if (!user) {
      return {
        errors: {
          _form: ["Invalid or expired reset code"],
        },
      };
    }

    user.password = await hashPassword(result.data.password);
    user.resetCode = null;

    await user.save();

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
