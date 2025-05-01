import React from 'react';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex gap-1 text-yellow-500 text-3xl">
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <span key={i}>★</span>
        ))}
      {hasHalfStar && <span>☆</span>}
      {Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))
        .fill()
        .map((_, i) => (
          <span key={i + fullStars + 1}>☆</span>
        ))}
    </div>
  );
};

export default StarRating;
