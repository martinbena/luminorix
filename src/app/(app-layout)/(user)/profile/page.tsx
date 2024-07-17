import DashboardLayout from "@/components/admin/DashboardLayout";
import Profile from "@/components/user/Profile";
import ProfileSkeleton from "@/components/user/ProfileSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function UserPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </Suspense>
    </DashboardLayout>
  );
}
