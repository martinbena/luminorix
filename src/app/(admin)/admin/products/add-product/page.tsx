import AddEditProductForm from "@/components/admin/AddEditProductForm";
import Button from "@/components/ui/Button";
import paths from "@/lib/paths";

export default function AdminAddProductPage() {
  return (
    <section className="[&>*:nth-child(2)]:mt-20">
      <Button type="secondary" href={paths.adminProductShow()}>
        Back to all products
      </Button>
      <AddEditProductForm />
    </section>
  );
}
