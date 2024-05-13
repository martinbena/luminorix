import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import type { User as UserType } from "next-auth";
import ConnectDB from "../db/connectDB";
import { authorizeUser } from "./brcypt";
import paths from "./paths";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      type: "credentials",
      credentials: {},
      async authorize(credentials): Promise<UserType | null> {
        await ConnectDB();
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await authorizeUser(email, password);
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }: any) {
      if (profile) {
        const { email, name, picture } = profile;
        await ConnectDB();
        const dbUser = await User.findOne({ email });
        if (!dbUser) {
          await User.create({
            email,
            name,
            image: picture,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        await ConnectDB();
        const userByEmail = await User.findOne({ email: user.email });
        userByEmail.password = undefined;
        userByEmail.resetCode = undefined;
        token.user = userByEmail;
      }
      return token;
    },
    async session({ session, token }: any) {
      // The user in the session does not have an ID and the role, therefore we need to get it
      if (session && token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: paths.login() },
};
