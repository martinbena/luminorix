import Dashboard from "@/components/admin/Dashboard";
import DashboardLayout from "@/components/admin/DashboardLayout";

export const revalidate = 300;

export default function AdminPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
