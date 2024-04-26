import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeadingSecondary from "@/components/HeadingSecondary";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    return redirect("/");
  }

  return (
    <div className="px-8">
      <HeadingSecondary>Register</HeadingSecondary>

      <div className="mx-auto flex justify-center mt-12 p-8 bg-zinc-100 text-zinc-800">
        <RegisterForm />
      </div>
    </div>
  );
}
