import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeadingSecondary from "@/components/HeadingSecondary";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import RegisterForm from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luminorix | Registration",
  description:
    "Sign up for a new account to access exclusive features. Create your personalized profile and join our community today.",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    return redirect("/");
  }

  return (
    <AuthFormContainer>
      <HeadingSecondary>Register to manage your orders</HeadingSecondary>
      <RegisterForm />
    </AuthFormContainer>
  );
}
