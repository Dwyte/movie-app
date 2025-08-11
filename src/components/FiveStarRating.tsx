import React from "react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  rating: number;
};

const FiveStarRating = ({ rating, ...rest }: Props) => {
  const halfRating = rating / 2;
  const fullStarsCount = Math.floor(halfRating);
  const decimalPart = halfRating % 1;
  const halfStarsCount = decimalPart >= 0.33 && decimalPart <= 0.66 ? 1 : 0;
  const emptyStarsCount = 5 - fullStarsCount - halfStarsCount;

  return (
    <div {...rest}>
      <div className="text-red-600 flex gap-1">
        {Array.from({ length: fullStarsCount }, (v, k) => (
          <BsStarFill key={k} />
        ))}
        {halfStarsCount === 1 && <BsStarHalf />}
        {Array.from({ length: Math.floor(emptyStarsCount) }, (v, k) => (
          <BsStar key={fullStarsCount + halfStarsCount + k} />
        ))}
      </div>
    </div>
  );
};

export default FiveStarRating;
