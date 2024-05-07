import HeadingSecondary from "@/components/ui/HeadingSecondary";
import AddCategoryForm from "@/components/admin/AddCategoryForm";
import AdminActions from "@/components/admin/AdminActions";
import TableContainer from "@/components/data-tables/TableContainer";
import Table from "@/components/data-tables/Table";
import TableHeader from "@/components/data-tables/TableHeader";
import TableBody from "@/components/data-tables/TableBody";
import TableRow from "@/components/data-tables/TableRow";
import { getAllCategories } from "@/db/queries/categories";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <HeadingSecondary>Manage all categories</HeadingSecondary>
      <section className="mt-12 py-8">
        <AddCategoryForm />

        <TableContainer>
          <Table>
            <TableHeader>Categories</TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <div className="font-semibold tracking-wide">
                    {category.title}
                  </div>
                  <AdminActions />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </>
  );
}
