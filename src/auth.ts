import NextAuth from "next-auth";
import { authConfig } from "./lib/authConfig";
import { ExtendedUser } from "../next-auth";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

export async function validateUserSession(userId?: string): Promise<{
  authenticated: boolean;
  authorized?: boolean;
  user?: ExtendedUser;
  authError: string;
}> {
  const response = {
    authenticated: false,
    authorized: false,
    user: undefined as ExtendedUser | undefined,
    authError: "",
  };
  const session = await auth();

  if (!session || !session.user) {
    response.authError = "You must be logged in to do this";
    return response;
  }

  response.authenticated = true;
  response.user = session.user;

  if (
    session.user.role !== "admin" &&
    userId &&
    userId !== session.user._id.toString()
  )
    response.authError = "You are not authorized to do this";

  if (
    session.user.role === "admin" ||
    (userId && userId === session.user._id.toString())
  )
    response.authorized = true;

  return response;
}
