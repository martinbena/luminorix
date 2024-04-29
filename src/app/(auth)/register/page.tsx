import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeadingSecondary from "@/components/HeadingSecondary";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import RegisterForm from "@/components/auth/RegisterForm";

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
