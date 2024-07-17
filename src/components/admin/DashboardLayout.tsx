import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <section className="font-sans flex flex-col gap-4 max-w-8xl mx-auto [&>*:nth-child(1)]:mb-12">
      {children}
    </section>
  );
}
