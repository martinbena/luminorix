import { ReactNode } from "react";

interface DashboardFeatureProps {
  title?: string;
  children: ReactNode;
}

export default function DashboardFeature({
  children,
  title,
}: DashboardFeatureProps) {
  return (
    <div className="shadow-form p-8 mob:px-4 rounded-md">
      {title && <h3 className="font-semibold text-2xl mb-8">{title}</h3>}
      {children}
    </div>
  );
}
