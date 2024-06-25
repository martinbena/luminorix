import paths from "@/lib/paths";
import { Category } from "@/models/Category";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";

interface ProductBreadcrumbProps {
  productTitle: string;
  productCategory: Category;
}

export default function ProductBreadcrumb({
  productTitle,
  productCategory,
}: ProductBreadcrumbProps) {
  return (
    <nav className="flex font-sans py-4 items-center">
      <Link href={paths.home()}>
        <FaHouseChimney className="h-5 w-5 text-amber-500 hover:text-amber-600" />
      </Link>
      <Divider />
      <Link
        className="hover:underline"
        href={`${paths.productShowAll()}?category=${productCategory.slug}`}
      >
        {productCategory.title}
      </Link>
      <Divider />
      <span className="font-semibold">{productTitle}</span>
    </nav>
  );
}

function Divider() {
  return (
    <span className="text-zinc-400 px-4">
      <FaChevronRight />
    </span>
  );
}
