import AddEditProductForm from "@/components/admin/AddEditProductForm";
import Button from "@/components/ui/Button";
import { getAllCategories } from "@/db/queries/categories";
import paths from "@/lib/paths";

export default async function AdminAddProductPage() {
  const categories = await getAllCategories();

  return (
    <section className="[&>*:nth-child(2)]:mt-20">
      <Button type="secondary" href={paths.adminProductShow()}>
        Back to all products
      </Button>
      <AddEditProductForm categories={categories} />
    </section>
  );
}
