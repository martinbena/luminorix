import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeadingSecondary from "@/components/HeadingSecondary";
import LoginForm from "@/components/auth/LoginForm";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luminorix | Login",
  description:
    "Log in to your account to access your personalized dashboard. Enjoy seamless access to your account and stay connected with our platform.",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    return redirect("/");
  }

  return (
    <AuthFormContainer>
      <HeadingSecondary>Welcome back!</HeadingSecondary>
      <LoginForm />
    </AuthFormContainer>
  );
}
