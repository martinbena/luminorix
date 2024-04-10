import Button from "../Button";
import HeadingSecondary from "../HeadingSecondary";
import Product from "../products/Product";

export default function NewestProducts() {
    return (
      <div className="py-16">
        <HeadingSecondary>Newest products</HeadingSecondary>
        <div className="my-8 grid grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] gap-8 max-w-7xl mx-auto">
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