import Button from "@/components/ui/Button";
import HeadingSecondary from "@/components/ui/HeadingSecondary";
import paths from "@/lib/paths";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center min-h-[65vh]">
      <HeadingSecondary>Error</HeadingSecondary>
      <p className="mt-2 mb-6 text-base">Page not found</p>
      <div>
        <Button type="secondary" href={paths.productShowAll()}>
          Continue shopping
        </Button>
      </div>
    </div>
  );
}
