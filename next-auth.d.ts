import { ObjectId } from "mongoose";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  _id: ObjectId;
  role: "admin" | "user";
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
