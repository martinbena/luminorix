import HeadingTertiary from "../HeadingTertiary";

export default function AboutUs() {
  return (
    <div className="w-1/2">
      <HeadingTertiary>About the shop</HeadingTertiary>
      <p className="pt-6 pb-8">
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
