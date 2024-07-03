import { useCartContext } from "@/app/contexts/CartContext";
import { CartActionsProps } from "./CartActions";
import { IoChevronDown, IoChevronUp, IoClose } from "react-icons/io5";
import { getProductVariantTitle } from "@/lib/helpers";

export default function UpdateItemQuantity({ product }: CartActionsProps) {
  const {
    getCurrentItemQuantity,
    increaseItemQuantity,
    decreaseItemQuantity,
    deleteItem,
  } = useCartContext();
  const { sku, title, color, size, stock } = product;
  const composedTitle = getProductVariantTitle(title, color, size);
  const quantity = getCurrentItemQuantity(sku);
  return (
    <div className="w-full flex justify-center items-center gap-2">
      <div className="flex items-center gap-4 mob-sm:gap-2 text-xl bg-white px-3.5 font-sans py-1.5 border-2 border-zinc-200 rounded-full">
        <button
          aria-label={`Add one ${composedTitle} to your cart`}
          type="button"
          onClick={() => increaseItemQuantity(sku)}
          disabled={quantity === stock}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoChevronUp />
        </button>
        <span className="w-10 flex justify-center items-center">
          {quantity}
        </span>
        <button
          aria-label={`Remove one ${composedTitle} from your cart`}
          type="button"
          onClick={() => decreaseItemQuantity(sku)}
        >
          <IoChevronDown />
        </button>
      </div>
      <button
        type="button"
        aria-label={`Remove all ${composedTitle} from your cart`}
        className="flex justify-center items-center rounded-full border-2 border-zinc-200 bg-white h-10 w-10 aspect-square"
        onClick={() => deleteItem(sku)}
      >
        <IoClose className="h-5 w-5" />
      </button>
    </div>
  );
}
