// frontend/src/components/ReviewCard.jsx (ไฟล์ใหม่)

import React from 'react';
import { FaStar } from 'react-icons/fa';
import './ReviewCard.css'; // เดี๋ยวเราจะสร้างไฟล์นี้

function ReviewCard({ review }) {
  // ฟังก์ชันสำหรับสร้างดาวตามคะแนน
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} color={i < rating ? "#ffc107" : "#e4e5e9"} />
      );
    }
    return stars;
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <img 
          src={`https://api.dicebear.com/8.x/initials/svg?seed=${review.authorName}`} 
          alt="avatar" 
          className="review-author-avatar"
        />
        <div className="review-author-info">
          <p className="review-author-name">{review.authorName}</p>
          <div className="review-stars">{renderStars(review.rating)}</div>
        </div>
      </div>
      <p className="review-comment">{review.comment}</p>
      <p className="review-date">
        {/* แปลง Timestamp ของ Firebase ให้เป็นวันที่ที่อ่านง่าย */}
        {review.createdAt ? new Date(review.createdAt.toDate()).toLocaleDateString('th-TH') : '...'}
      </p>
    </div>
  );
}

export default ReviewCard;