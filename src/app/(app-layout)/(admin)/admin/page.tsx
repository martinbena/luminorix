import Dashboard from "@/components/admin/Dashboard";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const revalidate = 300;

export default function AdminPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
