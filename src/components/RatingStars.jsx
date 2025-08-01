import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function RatingStars({ rating, reviewCount }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} color="#ffc107" />);
  if (halfStar) stars.push(<FaStarHalfAlt key="half" color="#ffc107" />);
  for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} color="#e4e5e9" />);

  return (
    <div className="rating-container">
      {stars}
      {reviewCount > 0 && <span className="review-count">({reviewCount} รีวิว)</span>}
    </div>
  );
}

export default RatingStars;