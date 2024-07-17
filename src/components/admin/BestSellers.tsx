"use client";

import {
  BestEarningProduct,
  BestSellingProduct,
  TopSellingAndEarningProducts,
} from "@/db/queries/admin";
import { formatLargeCurrency } from "@/lib/helpers";
import Image from "next/image";
import { ReactNode, useState } from "react";
import DashboardList from "./DashboardList";

const gridOptions =
  "grid grid-cols-[2.75rem_1fr_max-content] gap-4 items-center";

export default function BestSellers({
  bestSellers,
  bestEarners,
}: TopSellingAndEarningProducts) {
  const [selectedGroup, setSelectedGroup] = useState<string>("sellers");
  return (
    <div>
      <div className="font-semibold flex items-center gap-3 text-base justify-center child-hover:underline mb-2.5">
        <Selector
          onClick={() => setSelectedGroup("sellers")}
          isActive={selectedGroup === "sellers"}
        >
          Best Sellers
        </Selector>
        <span className="font-normal">|</span>
        <Selector
          onClick={() => setSelectedGroup("earners")}
          isActive={selectedGroup === "earners"}
        >
          Best Earners
        </Selector>
      </div>
      <Header selectedGroup={selectedGroup} />
      <DashboardList>
        {selectedGroup === "sellers" && (
          <>
            {bestSellers.map((product) => (
              <ListItem key={product.title} product={product} />
            ))}
          </>
        )}
        {selectedGroup === "earners" && (
          <>
            {bestEarners.map((product) => (
              <ListItem key={product.title} product={product} />
            ))}
          </>
        )}
      </DashboardList>
    </div>
  );
}

interface SelectorProps {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}

function Selector({ isActive, onClick, children }: SelectorProps) {
  return (
    <button className={`${isActive ? "underline" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

interface HeaderProps {
  selectedGroup: string;
}

function Header({ selectedGroup }: HeaderProps) {
  return (
    <div className={`${gridOptions} font-medium pb-2.5`}>
      <span>&nbsp;</span>
      <p>Product</p>
      <p>{`${selectedGroup === "sellers" ? "Sold" : "Earned"}`}</p>
    </div>
  );
}

interface ListItemProps {
  product: BestSellingProduct | BestEarningProduct;
}

function isBestEarningProduct(
  product: BestSellingProduct | BestEarningProduct
): product is BestEarningProduct {
  return (product as BestEarningProduct).totalEarnings !== undefined;
}

function ListItem({ product }: ListItemProps) {
  const { title, image } = product;
  return (
    <li className={`${gridOptions} py-[0.5625rem]`} key={title}>
      <div className="aspect-square relative h-11 w-11 rouned-md">
        <Image
          src={image!}
          fill
          alt={title}
          className="object-cover rounded-md"
          sizes="50vw"
        />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-base font-semibold">
        {isBestEarningProduct(product)
          ? formatLargeCurrency(product.totalEarnings)
          : product.soldTotal}
      </p>
    </li>
  );
}
