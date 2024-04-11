import Button from "../Button";
import HeadingSecondary from "../HeadingSecondary";
import Product from "../products/Product";

export default function TopDiscounts() {
  return (
    <div className="bg-zinc-100 py-10 px-8">
      <HeadingSecondary>Top dicounts</HeadingSecondary>
      <div className="my-8 grid grid-cols-[repeat(auto-fit,_minmax(14rem,_1fr))] gap-8 max-w-8xl mx-auto">
        <Product />
        <Product />
        <Product />
        <Product />
      </div>

      <div className="text-center child:w-96">
        <Button type="tertiary">View all</Button>
      </div>
    </div>
  );
}
