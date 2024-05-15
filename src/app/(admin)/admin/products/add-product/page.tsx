import AddEditProductForm from "@/components/admin/AddEditProductForm";
import AddVariantForm from "@/components/admin/AddVariantForm";
import Button from "@/components/ui/Button";
import { getAllCategories } from "@/db/queries/categories";
import { getAllProducts } from "@/db/queries/products";
import paths from "@/lib/paths";

export default async function AdminAddProductPage() {
  const categories = await getAllCategories();
  const products = await getAllProducts();

  return (
    <section className="[&>*:nth-child(2)]:my-20">
      <Button type="secondary" href={paths.adminProductShow()}>
        Back to all products
      </Button>
      <AddEditProductForm categories={categories} />
      <AddVariantForm products={products} />
    </section>
  );
}
