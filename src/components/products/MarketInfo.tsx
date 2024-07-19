import { PiCheck } from "react-icons/pi";
import HeadingSecondary from "../ui/HeadingSecondary";

const marketRules = [
  "Only signed-in users can list items in their profiles",
  "You can only list items that are currently in our catalog",
  "The price must be a maximum of 35% of the average price of the product",
  "There are no fees for using this service",
];

export default function MarketInfo() {
  return (
    <article className="bg-white p-8 rounded-xl font-sans shadow-form mb-12 [&>*:nth-child(1)]:text-amber-600 mob:p-4">
      <HeadingSecondary>Market information</HeadingSecondary>
      <div className="mt-6 font-sans ">
        <p className="mb-4 text-base mob:text-sm">
          Welcome to our market. Here, you can browse listings from other users,
          sell your items, and find great deals. Please note the following
          rules:
        </p>
        <ul className="flex flex-col gap-3">
          {marketRules.map((rule, i) => (
            <li
              key={i}
              className="flex gap-3 items-center ml-4 font-medium mob:items-start mob:ml-1"
            >
              <div className="flex-shrink-0 w-5 h-5">
                <PiCheck className="w-full h-full text-amber-600" />
              </div>

              <span className="break-words">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
