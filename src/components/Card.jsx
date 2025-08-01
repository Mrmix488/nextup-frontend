
import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; 

function Card({ service }) {
  return (
    <Link to={`/service/${service.id}`} className="card">
      {/* --- 2. เปลี่ยน <img> เป็น <LazyLoadImage> --- */}
      <LazyLoadImage
        alt={service.title}
        src={service.coverImage}
        effect="blur" 
        width="100%"
        height="180px"
        className="card-image-lazy"
      />
      {/* --- จบส่วนแก้ไข --- */}

      <div className="card-content">
        {/* ... ส่วนที่เหลือเหมือนเดิม ... */}
      </div>
    </Link>
  );
}
export default Card;