import { ReactElement } from "react";

interface ProfileStatProps {
  color: string;
  iconColor: string;
  icon: ReactElement;
  title: string;
  value: number | string;
}

export default function ProfileStat({
  color,
  icon,
  iconColor,
  title,
  value,
}: ProfileStatProps) {
  return (
    <div className="p-4 flex items-center gap-4 shadow-form rounded-md">
      <div
        className={`h-16 w-16 flex justify-center items-center rounded-full ${color} child:h-8 child:w-8 ${iconColor}`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1 child:leading-none">
        <p className="uppercase font-semibold text-xs text-zinc-500 tracking-wide">
          {title}
        </p>
        <p className="font-medium text-2xl dt-sm:text-xl">{value}</p>
      </div>
    </div>
  );
}
