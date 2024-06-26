import { auth } from "@/auth";
import { getUserReviews } from "@/db/queries/user";
import { format } from "date-fns";
import Link from "next/link";
import { TfiNotepad } from "react-icons/tfi";
import Stars from "../products/Stars";
import ReviewActions from "./ReviewActions";
import { getFirstVariantSkuBySlug } from "@/db/queries/product";

interface SlugSkuPairs {
  [slug: string]: string;
}

export default async function Reviews() {
  const session = await auth();
  const reviews = session?.user
    ? await getUserReviews(session?.user._id.toString())
    : [];
  const slugSkuPairs: SlugSkuPairs = {};
  for (const review of reviews) {
    const { slug } = review;
    const sku = await getFirstVariantSkuBySlug(slug);
    slugSkuPairs[slug] = sku;
  }

  return (
    <>
      {reviews.length > 0 ? (
        <ul className="max-w-5xl mx-auto flex flex-col gap-6">
          {reviews.map((item) => {
            return (
              <li key={item.title} className="flex border border-amber-500">
                <div className="px-6 py-3 flex-grow">
                  <h3 className="font-semibold text-2xl mb-2">
                    <Link
                      className="hover:underline"
                      href={`/${item.slug}/${slugSkuPairs[item.slug]}`}
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <div className="mb-3">
                    <Stars rating={item.review.rating} />
                  </div>
                  <p className="text-base">{item.review.comment}</p>
                  <p className="text-right font-sans text-zinc-600 mt-4">
                    Rated{" "}
                    {format(
                      new Date(item.review.createdAt),
                      "MMM dd yyyy, h:mm aa"
                    )}
                  </p>
                </div>
                <ReviewActions rating={JSON.parse(JSON.stringify(item))} />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <TfiNotepad className="text-zinc-300 h-24 w-24" />
          <p className="text-lg">You have not written any reviews yet</p>
        </div>
      )}
    </>
  );
}
