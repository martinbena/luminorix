import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeadingSecondary from "@/components/HeadingSecondary";
import LoginForm from "@/components/auth/LoginForm";
import AuthFormContainer from "@/components/auth/AuthFormContainer";

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
