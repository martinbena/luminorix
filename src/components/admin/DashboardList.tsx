import { PropsWithChildren } from "react";

export default function DashboardList({ children }: PropsWithChildren) {
  return (
    <ul className="flex flex-col border-b border-t border-gray-100 divide-y divide-gray-100">
      {children}
    </ul>
  );
}
