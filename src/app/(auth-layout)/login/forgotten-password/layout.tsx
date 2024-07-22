import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forgotten Password",
  description:
    "Reset your password quickly and securely. Enter your email to receive a 6-digit verification code, then set a new password to regain access to your account.",
};

export default async function ForgottenPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session?.user) {
    return redirect("/");
  }
  return <>{children}</>;
}
