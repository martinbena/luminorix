"use client";

import ErrorUI from "@/components/ui/ErrorUI";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorUI error={error} reset={reset} />;
}
