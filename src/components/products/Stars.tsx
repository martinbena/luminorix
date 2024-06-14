import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarsProps {
  rating: number;
}

function Stars({ rating }: StarsProps) {
  const stars = [];
  const classes = "text-amber-500 h-4 w-4";

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className={classes} />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} className={classes} />);
    } else {
      stars.push(<FaRegStar key={i} className={classes} />);
    }
  }
  return <div className="flex">{stars}</div>;
}

export default Stars;
