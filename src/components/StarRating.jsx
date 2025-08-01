

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

function StarRating({ rating, onRating }) {
  const [hover, setHover] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onRating(ratingValue)}
              style={{ display: 'none' }}
            />
            <FaStar
              size={30}
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            />
          </label>
        );
      })}
    </div>
  );
}

export default StarRating;