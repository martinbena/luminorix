import { auth } from "@/auth";
import HeadingSecondary from "@/components/ui/HeadingSecondary";
import ChangePasswordForm from "@/components/user/ChangePasswordForm";
import EditAccountForm from "@/components/user/EditAccountForm";
import User from "@/models/User";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function UserSettingsPage() {
  const session = await auth();
  const user = await User.findById(session?.user._id);
  const isGoogleUser = user.email?.includes("@gmail.com");

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <HeadingSecondary>Your account settings</HeadingSecondary>

        <div className="mt-8 flex flex-col gap-6">
          {isGoogleUser ? (
            <p className="px-4 py-2 bg-orange-100 text-orange-700 max-w-max">
              You are signed in with a Google account, so you must make changes
              to your account elsewhere
            </p>
          ) : null}
          <EditAccountForm
            user={JSON.parse(JSON.stringify(user))}
            isGoogleUser={isGoogleUser}
          />
        </div>
      </div>
      <hr className="text-zinc-400 my-12" />
      <ChangePasswordForm
        user={JSON.parse(JSON.stringify(user))}
        isGoogleUser={isGoogleUser}
      />
    </>
  );
}
