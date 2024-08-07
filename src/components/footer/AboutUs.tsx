import HeadingTertiary from "../ui/HeadingTertiary";

export default function AboutUs() {
  return (
    <div className="max-w-seventy mob-lg:order-2 mob-lg:max-w-full">
      <HeadingTertiary>About the shop</HeadingTertiary>
      <p className="pt-6 pb-8 mob-lg:py-4">
        Embrace luxury and sophistication with our curated collection, embodying
        timeless elegance and exceptional quality for all shoppers.
      </p>
      <p>
        &copy; Copyright 2024 by{" "}
        <span className="text-amber-700">Martin Beňa</span>. All rights
        reserved.
      </p>
    </div>
  );
}
