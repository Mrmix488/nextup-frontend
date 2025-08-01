

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, runTransaction } from 'firebase/firestore';
import StarRating from '../components/StarRating'; 

function LeaveReviewPage() {
  const { freelancerId } = useParams(); 
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("กรุณาให้คะแนนอย่างน้อย 1 ดาว");
      return;
    }
    setError('');

    try {
      
      const reviewsRef = collection(db, "users", freelancerId, "reviews");
      await addDoc(reviewsRef, {
        rating: rating,
        comment: comment,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email.split('@')[0], 
        createdAt: serverTimestamp()
      });

      
      const freelancerRef = doc(db, "users", freelancerId);
      await runTransaction(db, async (transaction) => {
        const freelancerDoc = await transaction.get(freelancerRef);
        if (!freelancerDoc.exists()) {
          throw "Freelancer not found!";
        }
        const data = freelancerDoc.data();
        const newReviewCount = (data.reviewCount || 0) + 1;
        const newRatingTotal = (data.rating || 0) * (data.reviewCount || 0) + rating;
        const newAverageRating = newRatingTotal / newReviewCount;
        
        transaction.update(freelancerRef, {
          reviewCount: newReviewCount,
          rating: parseFloat(newAverageRating.toFixed(1)) 
        });
      });

      
      navigate(`/profile/${freelancerId}`);
    } catch (err) {
      console.error("Error submitting review: ", err);
      setError("เกิดข้อผิดพลาดในการส่งรีวิว");
    }
  };

  return (
    <div className="container">
      <div className="static-page-container">
        <h1>เขียนรีวิว</h1>
        <p>ให้คะแนนการบริการที่คุณได้รับ</p>
        <form onSubmit={handleSubmitReview}>
          <div className="form-group">
            <label>คะแนนของคุณ</label>
            <StarRating rating={rating} onRating={setRating} />
          </div>
          <div className="form-group">
            <label htmlFor="comment">ความคิดเห็น (ไม่บังคับ)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
            ></textarea>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">ส่งรีวิว</button>
        </form>
      </div>
    </div>
  );
}

export default LeaveReviewPage;