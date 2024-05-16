import HeadingSecondary from "@/components/ui/HeadingSecondary";
import AddEditCategoryForm from "@/components/admin/AddEditCategoryForm";
import AdminActions from "@/components/admin/AdminActions";
import TableContainer from "@/components/data-tables/TableContainer";
import Table from "@/components/data-tables/Table";
import TableHeader from "@/components/data-tables/TableHeader";
import TableBody from "@/components/data-tables/TableBody";
import TableRow from "@/components/data-tables/TableRow";
import { getAllCategories } from "@/db/queries/categories";
import { Category } from "@/models/Category";
import ItemTitle from "@/components/data-tables/ItemTitle";
import * as actions from "@/actions";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <HeadingSecondary>Manage all categories</HeadingSecondary>
      <section className="mt-12 py-8">
        <AddEditCategoryForm />

        <TableContainer>
          <Table maxWidth="max-w-2xl">
            <TableHeader>Categories</TableHeader>
            <TableBody
              data={categories}
              render={(category: Category) => (
                <TableRow key={category._id}>
                  <ItemTitle>{category.title}</ItemTitle>
                  <AdminActions
                    item={category}
                    onDelete={actions.deleteCategory.bind(null, category._id)}
                    editForm={
                      <AddEditCategoryForm
                        isEditSession={true}
                        category={category}
                      />
                    }
                  />
                </TableRow>
              )}
            />
          </Table>
        </TableContainer>
      </section>
    </>
  );
}
