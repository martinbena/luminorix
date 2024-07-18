import Button from "@/components/ui/Button";
import AddMarketItemForm from "@/components/user/AddEditMarketItemForm";
import { getAllProducts } from "@/db/queries/products";
import paths from "@/lib/paths";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Market Items",
};

export default async function MarketItemCreatePage() {
  const products = await getAllProducts();

  return (
    <section className="[&>*:nth-child(2)]:my-20 max-w-2xl mx-auto">
      <Button type="secondary" href={paths.userMarketItemShow()}>
        Back to all items
      </Button>
      <AddMarketItemForm products={products} />
    </section>
  );
}
