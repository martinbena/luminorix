import Button from "./Button";
import HeadingSecondary from "./HeadingSecondary";

export default function ErrorUI({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex justify-center items-center flex-col gap-6">
      <HeadingSecondary>Something went wrong!</HeadingSecondary>
      <p className="text-base font-sans">{error.message}</p>

      <Button type="secondary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
