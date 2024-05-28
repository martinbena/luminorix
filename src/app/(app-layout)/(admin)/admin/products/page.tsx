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
import { Metadata } from "next";
import SortBy from "@/components/ui/SortBy";
import { productSortOptions } from "@/db/queries/sortOptions";

export const metadata: Metadata = {
  title: "Products",
};

interface AdminAllProductsPageProps {
  searchParams: { sortBy: string };
}

export default async function AdminAllProductsPage({
  searchParams,
}: AdminAllProductsPageProps) {
  const sortBy = searchParams?.sortBy;
  const categories = await getAllCategories();
  const products = await getAllProductsWithVariants(sortBy);

  const tableColumns =
    "grid-cols-[0.6fr_2.5fr_1.2fr_1.5fr_1fr_0.4fr] mob-lg:grid-cols-[0.6fr_3fr_1.7fr_1.5fr_0.4fr] mob:grid-cols-[0.6fr_4fr_2.2fr_0.4fr] mob-sm:grid-cols-[0.6fr_6.2fr_0.4fr]";
  return (
    <>
      <HeadingSecondary>Manage all products</HeadingSecondary>
      <section className="mt-12 py-8">
        <div className="flex justify-between">
          <Button type="secondary" href={paths.adminProductCreate()}>
            Add new products
          </Button>
          <SortBy options={productSortOptions} />
        </div>

        <TableContainer>
          <Table maxWidth="max-w-5xl">
            <TableHeader numColumns={tableColumns}>
              <span className="mob-sm:hidden">&nbsp;</span>
              <span className="mob-sm:col-span-3">Product</span>
              <span className="mob:hidden">Brand</span>
              <span className="mob-sm:hidden">Price</span>
              <span className="mob-lg:hidden">Discount</span>
              <span className="mob-sm:hidden">&nbsp;</span>
            </TableHeader>
            <TableBody
              data={products}
              render={(product: ProductWithVariant) => (
                <TableRow numColumns={tableColumns} key={product._id}>
                  <div className="w-16 relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={`Image of ${product.title}`}
                      className="object-cover"
                      fill
                      sizes="50vw"
                    />
                  </div>
                  <ItemTitle>
                    {`${product?.title}${
                      product?.color || product?.size ? "," : ""
                    }${product?.color ? ` ${product.color}` : ""}${
                      product?.size ? ` ${product.size}` : ""
                    }`}
                  </ItemTitle>
                  <div className="mob:hidden">{product.brand}</div>
                  <div className="font-semibold mob-sm:hidden">
                    {formatCurrency(product.price)}
                  </div>
                  <div className="font-semibold mob-lg:hidden">
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
                    onDelete={actions.removeVariantFromProduct.bind(
                      null,
                      product._id,
                      product.sku
                    )}
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
