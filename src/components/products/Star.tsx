import { FaRegStar, FaStar } from "react-icons/fa";

interface StarProps {
  onRate: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
  isFull: boolean;
}

export default function Star({
  onRate,
  isFull,
  onHoverIn,
  onHoverOut,
}: StarProps) {
  return (
    <span
      role="button"
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      className="text-amber-500 child:w-8 child:h-8 cursor-pointer"
    >
      {isFull ? <FaStar /> : <FaRegStar />}
    </span>
  );
}
