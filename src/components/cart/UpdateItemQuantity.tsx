import { useCartContext } from "@/app/contexts/CartContext";
import { CartActionsProps } from "./CartActions";
import { IoChevronDown, IoChevronUp, IoClose } from "react-icons/io5";

export default function UpdateItemQuantity({ product }: CartActionsProps) {
  const {
    getCurrentItemQuantity,
    increaseItemQuantity,
    decreaseItemQuantity,
    deleteItem,
  } = useCartContext();
  const { sku } = product;
  const quantity = getCurrentItemQuantity(sku);
  return (
    <div className="w-full flex justify-center gap-2">
      <div className="flex items-center gap-5 text-xl bg-white px-3.5 font-sans py-1.5 border border-zinc-300 rounded-full">
        <button type="button" onClick={() => increaseItemQuantity(sku)}>
          <IoChevronUp />
        </button>
        <span className="w-10 flex justify-center items-center">
          {quantity}
        </span>
        <button type="button" onClick={() => decreaseItemQuantity(sku)}>
          <IoChevronDown />
        </button>
      </div>
      <button
        type="button"
        className="flex justify-center items-center rounded-full border border-zinc-300 bg-white h-full aspect-square"
        onClick={() => deleteItem(sku)}
      >
        <IoClose className="h-5 w-5" />
      </button>
    </div>
  );
}
