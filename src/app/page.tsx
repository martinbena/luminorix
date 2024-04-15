import DiscountSection from "@/components/home/DiscountSection";
import Product from "@/components/products/Product";
import ProductRow from "@/components/products/ProductRow";
import paths from "@/paths";

export default function Home() {
  return (
    <>
      <DiscountSection />

      <ProductRow
        title="Newest products"
        hasLink={true}
        linkTo={paths.productShowAll()}
        sectionClasses="py-16 bg-white"
        gridSize="large"
      >
        <Product />
        <Product />
        <Product />
      </ProductRow>

      <ProductRow
        title="Top discounts"
        hasLink={true}
        linkTo={paths.tagShow("discounts")}
      >
        <Product />
        <Product />
        <Product />
        <Product />
      </ProductRow>
    </>
  );
}
