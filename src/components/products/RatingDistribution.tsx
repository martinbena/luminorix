import { FaStar, FaRegStar } from "react-icons/fa";
import Stars from "./Stars";
import { Rating } from "@/models/Product";

interface RatingDistributionProps {
  ratings: Rating[];
  averageRating: number;
}

export default function RatingDistribution({
  ratings,
  averageRating,
}: RatingDistributionProps) {
  const defaultDistribution = {
    5: 1,
    4: 1,
    3: 0,
    2: 0,
    1: 0,
  };

  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  if (ratings.length === 0) {
    Object.assign(distribution, defaultDistribution);
    averageRating = 4.5;
  } else {
    ratings.forEach((rating) => {
      distribution[rating.rating]++;
    });
  }

  const totalRatings = ratings.length === 0 ? 2 : ratings.length;

  const ratingIcons = Object.keys(distribution)
    .map((rating) => {
      const count = distribution[+rating as keyof typeof distribution];
      let percentage = +((count / totalRatings) * 100).toFixed(2);
      const starClasses = "text-amber-500 w-4 h-4";
      const starIcons = Array.from({ length: parseInt(rating) }, (_, index) => (
        <FaStar key={index} className={starClasses} />
      ));
      const emptyStarIcons = Array.from(
        { length: 5 - parseInt(rating) },
        (_, index) => <FaRegStar className={starClasses} key={index} />
      );
      return (
        <div
          key={rating}
          className="flex gap-4 justify-between items-center my-1"
        >
          <div className="flex-1">
            <div className="w-full bg-zinc-200 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right flex gap-2 w-32">
            <div className="flex items-center">
              {starIcons}
              {emptyStarIcons}
            </div>
            <span className="text-base">{Math.round(percentage)}%</span>
          </div>
        </div>
      );
    })
    .reverse();

  return (
    <div className="flex flex-wrap font-sans max-w-3xl mx-auto w-full mob:flex-col mob:items-center mob:gap-4">
      <div className="w-1/4 mob:w-full flex items-center justify-center pr-2">
        <div className="flex flex-col justify-center items-center">
          <p className="text-5xl font-bold mb-5">{averageRating?.toFixed(1)}</p>
          <Stars rating={averageRating} />
          <p className="mt-1.5 text-base tab-lg:text-sm tab:text-base">
            Product Rating
          </p>
        </div>
      </div>
      <div className="w-3/4 mob:w-full">{ratingIcons}</div>
    </div>
  );
}
