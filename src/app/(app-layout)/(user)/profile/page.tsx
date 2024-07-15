import Profile from "@/components/user/Profile";
import ProfileSkeleton from "@/components/user/ProfileSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function UserPage() {
  return (
    <section className="font-sans flex flex-col gap-16 mob:gap-12 max-w-8xl mx-auto">
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </Suspense>
    </section>
  );
}
