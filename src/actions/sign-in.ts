"use server";

import * as auth from "@/lib/auth";

export async function signInWithCredentials() {
  return auth.signIn("credentials");
}
