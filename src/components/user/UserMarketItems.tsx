import * as actions from "@/actions";
import {
  ItemTitle,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/data-tables/Table";
import Image from "next/image";
import AdminActions from "../admin/AdminActions";
import { MarketItem } from "@/models/MarketItem";
import { Product } from "@/models/Product";
import AddEditMarketItemForm from "./AddEditMarketItemForm";
import { formatCurrency } from "@/lib/helpers";
import { getMarketItems } from "@/db/queries/market";
import { getAllProducts } from "@/db/queries/products";
import { auth } from "@/auth";
import Pagination from "../ui/Pagination";
import { AdminAllProductsPageProps } from "@/app/(app-layout)/(admin)/admin/products/page";

export default async function UserMarketItems({
  searchParams,
}: AdminAllProductsPageProps) {
  const session = await auth();
  const currentPage = +searchParams?.page || 1;

  const products = await getAllProducts();

  const { marketItems, totalCount } = await getMarketItems({
    marketItemId: undefined,
    userId: session?.user._id.toString(),
    searchParams,
    limit: true,
  });
  const tableColumns =
    "grid-cols-[0.6fr_2.5fr_1.2fr_1.5fr_1fr_0.4fr] mob-lg:grid-cols-[0.6fr_3fr_1.7fr_1.5fr_0.4fr] mob:grid-cols-[0.6fr_4fr_2.2fr_0.4fr] mob-sm:grid-cols-[0.6fr_6.2fr_0.4fr]";
  return (
    <TableContainer>
      <Table maxWidth="max-w-5xl">
        <TableHeader numColumns={tableColumns}>
          <span className="mob-sm:hidden">&nbsp;</span>
          <span className="mob-sm:col-span-3">Product</span>
          <span className="mob:hidden">Condition</span>
          <span className="mob-lg:hidden">Age</span>
          <span className="mob-sm:hidden">Price</span>
          <span className="mob-sm:hidden">&nbsp;</span>
        </TableHeader>
        <TableBody
          data={marketItems}
          render={(item: MarketItem) => (
            <TableRow numColumns={tableColumns} key={item._id}>
              <div className="w-16 relative aspect-square overflow-hidden">
                <Image
                  src={item.image}
                  alt={`Image of ${(item.product as Product).title}`}
                  className="object-cover"
                  fill
                  sizes="50vw"
                />
              </div>
              <ItemTitle>{(item.product as Product).title}</ItemTitle>
              <div className="mob:hidden font-medium">{item.condition}</div>
              <div className="mob-lg:hidden font-medium">{item.age} years</div>
              <div className="font-semibold mob-sm:hidden">
                {formatCurrency(item.price)}
              </div>
              <AdminActions<MarketItem>
                item={item}
                onDelete={actions.deleteMarketItem.bind(null, item._id)}
                editForm={
                  <AddEditMarketItemForm
                    isEditSession={true}
                    item={item}
                    products={products}
                  />
                }
              />
            </TableRow>
          )}
        />
        <TableFooter>
          <Pagination currentPage={currentPage} totalCount={totalCount} />
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
