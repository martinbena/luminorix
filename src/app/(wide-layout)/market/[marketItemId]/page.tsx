import { auth } from "@/auth";
import ProductBreadcrumb from "@/components/navigation/ProductBreadcrumb";
import ProductImage from "@/components/products/ProductImage";
import MessageForm from "@/components/user/MessageForm";
import { getAllMarketItemIds, getMarketItems } from "@/db/queries/market";
import { formatCurrency } from "@/lib/helpers";
import { User } from "@/models/User";
import { Metadata } from "next";
import Image from "next/image";
import probe from "probe-image-size";
import { PropsWithChildren, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Market",
  description:
    "Explore and browse user listings on our market page. Buy and sell items exclusively from our store current product catalog. Join the community and find great deals on your favorite products.",
};

export async function generateStaticParams() {
  const marketItemIds = await getAllMarketItemIds();
  return marketItemIds;
}

export default async function MarketItemPage({
  params,
}: {
  params: { marketItemId: string };
}) {
  const { marketItemId } = params;
  const { marketItems } = await getMarketItems({ marketItemId });
  const {
    _id: id,
    postedBy,
    price,
    age,
    condition,
    issues,
    image,
    responders,
    product,
  } = marketItems[0];
  const { width, height } = await probe(image);
  const session = await auth();

  return (
    <>
      <ProductBreadcrumb
        productTitle={marketItemId}
        productCategory={"Market"}
      />
      <div className="grid grid-cols-2 gap-16 max-w-8xl mx-auto tab:grid-cols-1 tab:gap-8 text-zinc-800">
        <div className="flex flex-col gap-8">
          <ProductImage
            title={product.title}
            image={image}
            size={{ width, height }}
          />
        </div>

        <div className="font-sans mb-8 flex flex-col gap-8">
          <Heading>{product.title}</Heading>
          <Price> {formatCurrency(price)}</Price>
          <Divider />
          <ListedBy listedBy={postedBy} />
          <ItemInformation title="Age in years">{age}</ItemInformation>
          <ItemInformation title="Condition">{condition}</ItemInformation>
          <ItemInformation title="Known issues or defects">
            {issues.length ? issues : "None"}
          </ItemInformation>
          <Divider />
          <ResponderInformation responders={responders} />
        </div>
      </div>
      <div className="py-8 bg-zinc-100 mob-lg:bg-white mob-lg:mt-0 mt-4">
        <MessageForm
          isExistingSession={session?.user ? true : false}
          recipientId={postedBy._id}
          marketItemId={id}
        />
      </div>
    </>
  );
}

function Divider() {
  return <hr className="text-zinc-400 my-4" />;
}

function Heading({ children }: PropsWithChildren) {
  return (
    <h2 className="font-semibold font-serif text-3xl mob-sm:text-2xl">
      {children}
    </h2>
  );
}

function Price({ children }: PropsWithChildren) {
  return <p className="text-2xl mob-sm:text-xl">{children}</p>;
}

interface ListedByProps {
  listedBy: User;
}

function ListedBy({ listedBy }: ListedByProps) {
  return (
    <div>
      <p className="font-semibold mb-3">Listed by</p>
      <div className="flex items-center gap-2">
        {listedBy.image && (
          <div className="relative h-12 w-12 aspect-square">
            <Image
              src={listedBy.image}
              alt={`Image of ${listedBy.name}`}
              fill
              sizes="20vw"
              className="object-cover rounded-full"
            />
          </div>
        )}
        <p className="text-base font-medium">{listedBy.name}</p>
      </div>
    </div>
  );
}

interface ItemInformationProps {
  children: ReactNode;
  title: string;
}
function ItemInformation({ children, title }: ItemInformationProps) {
  return (
    <div>
      <p className="font-semibold mb-3">{title}</p>
      <p className="text-base">{children}</p>
    </div>
  );
}

interface ResponderInformationProps {
  responders: User[];
}

function ResponderInformation({ responders }: ResponderInformationProps) {
  return (
    <div className="flex mob-sm:flex-col gap-2 items-center mob-sm:items-start">
      {responders.length > 0 && (
        <div className="flex [&>*:not(:first-child)]:-ml-4">
          {responders
            .filter(
              (responder) =>
                typeof responder.image === "string" && responder.image !== ""
            )
            .slice(0, 5)
            .map((responder) => (
              <Image
                key={responder._id}
                src={responder.image as string}
                width={48}
                height={48}
                alt={`Photo of ${responder.name}`}
                className="rounded-full border-[3px] border-white"
              />
            ))}
        </div>
      )}
      <p>
        {responders.length > 0 ? (
          <>
            {" "}
            <span className="font-semibold">{responders.length}</span>{" "}
            {`${responders.length === 1 ? "person" : " people"}`} responded to
            this sale
          </>
        ) : (
          <span className="font-medium">
            No one has responded to this sale yet
          </span>
        )}
      </p>
    </div>
  );
}
