import HeadingSecondary from "@/components/ui/HeadingSecondary";
import AddEditCategoryForm from "@/components/admin/AddEditCategoryForm";
import AdminActions from "@/components/admin/AdminActions";
import {
  Table,
  TableContainer,
  TableBody,
  TableHeader,
  TableRow,
  ItemTitle,
} from "@/components/data-tables/Table";
import { getAllCategories } from "@/db/queries/categories";
import { Category } from "@/models/Category";
import * as actions from "@/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <HeadingSecondary>Manage all categories</HeadingSecondary>
        <div className="mt-12 py-8 flex flex-col gap-16">
          <AddEditCategoryForm />

          <div>
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
                        onDelete={actions.deleteCategory.bind(
                          null,
                          category._id
                        )}
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
          </div>
        </div>
      </div>
    </>
  );
}
