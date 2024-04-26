import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import ConnectDB from "./lib/connectDB";
// import User from "@/models/User";
// import type { User as UserType } from "next-auth";
// import paths from "./lib/paths";
// import { authorizeUser } from "./lib/brcypt";
import { authConfig } from "./lib/authConfig";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
