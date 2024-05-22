import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration",
  description:
    "Sign up for a new account to access exclusive features. Create your personalized profile and join our community today.",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    return redirect("/");
  }

  return <RegisterForm />;
}
