import { ReactNode } from "react";

interface ProfileFeatureProps {
  title: string;
  children: ReactNode;
}

export default function ProfileFeature({
  children,
  title,
}: ProfileFeatureProps) {
  return (
    <div className="shadow-form p-8 mob:px-4 rounded-md">
      <h3 className="font-semibold text-2xl mb-8">{title}</h3>
      {children}
    </div>
  );
}
