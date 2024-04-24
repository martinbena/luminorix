import HeadingSecondary from "@/components/HeadingSecondary";
import LoginForm from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    return redirect("/");
  }

  return (
    <div className="px-8">
      <HeadingSecondary>Login</HeadingSecondary>

      <div className="mx-auto flex justify-center mt-12 p-8 bg-zinc-100 text-zinc-800">
        <LoginForm />
      </div>
    </div>
  );
}
