import AdminActions from "@/components/admin/AdminActions";
import ItemTitle from "@/components/data-tables/ItemTitle";
import Table from "@/components/data-tables/Table";
import TableBody from "@/components/data-tables/TableBody";
import TableContainer from "@/components/data-tables/TableContainer";
import TableHeader from "@/components/data-tables/TableHeader";
import TableRow from "@/components/data-tables/TableRow";
import Button from "@/components/ui/Button";
import HeadingSecondary from "@/components/ui/HeadingSecondary";
import { getAllProductsWithVariants } from "@/db/queries/products";
import paths from "@/lib/paths";
import { ProductWithVariant } from "@/models/Product";
import * as actions from "@/actions";
import AddEditProductForm from "@/components/admin/AddEditProductForm";
import { getAllCategories } from "@/db/queries/categories";
import { formatCurrency } from "@/lib/helpers";
import Image from "next/image";

export default async function AdminAllProductsPage() {
  const categories = await getAllCategories();
  const products = await getAllProductsWithVariants();

  const tableColumns = "grid-cols-[0.6fr_2.5fr_1.5fr_1fr_1fr_0.4fr]";
  return (
    <>
      <HeadingSecondary>Manage all products</HeadingSecondary>
      <section className="mt-12 py-8">
        <Button type="secondary" href={paths.adminProductCreate()}>
          Add new products
        </Button>

        <TableContainer>
          <Table maxWidth="max-w-5xl">
            <TableHeader numColumns={tableColumns}>
              <span>&nbsp;</span>
              <span>Product</span>
              <span>Brand</span>
              <span>Price</span>
              <span>Discount</span>
              <span>&nbsp;</span>
            </TableHeader>
            <TableBody
              data={products}
              render={(product: ProductWithVariant) => (
                <TableRow numColumns={tableColumns} key={product._id}>
                  <div className="h-16 w-16 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={`Image of ${product.title}`}
                      className="object-cover w-full h-auto"
                      sizes="100vw"
                      height={0}
                      width={0}
                    />
                  </div>
                  <ItemTitle>{product.title}</ItemTitle>
                  <div>{product.brand}</div>
                  <div className="font-semibold">
                    {formatCurrency(product.price)}
                  </div>
                  <div className="font-semibold">
                    {product.price < product.previousPrice ? (
                      <span className="text-green-600">
                        {formatCurrency(product.previousPrice - product.price)}
                      </span>
                    ) : (
                      <span>&mdash;</span>
                    )}
                  </div>
                  <AdminActions
                    item={product}
                    onDelete={actions.deleteCategory.bind(null, product._id)}
                    editForm={
                      <AddEditProductForm
                        isEditSession={true}
                        product={product}
                        categories={categories}
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
