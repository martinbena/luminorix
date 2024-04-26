import User from "@/models/User";
import { hash, compare } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await hash(password, 12);

  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export async function authorizeUser(email: string, password: string) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid e-mail or password");
  }

  if (!user?.password) {
    throw new Error("Please login via the method you used to sign up");
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    throw new Error("Invalid e-mail or password");
  }

  return user;
}
