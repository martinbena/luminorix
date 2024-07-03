import paths from "@/lib/paths";
import Button from "../ui/Button";

export default function EmptyCart() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center mt-24">
      <p className="text-lg font-sans">
        Your cart <b>is empty</b>
      </p>
      <Button type="secondary" href={paths.productShowAll()}>
        Continue shopping
      </Button>
    </div>
  );
}
