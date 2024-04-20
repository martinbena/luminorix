import { hash, compare } from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import ConnectDB from "./connectDB";
import User from "@/models/User";
import type { User as UserType } from "next-auth";
import paths from "./paths";

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

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      type: "credentials",
      credentials: {},
      async authorize(credentials): Promise<UserType | null> {
        ConnectDB();

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

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
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: paths.login() },
});
