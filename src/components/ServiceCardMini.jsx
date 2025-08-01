

import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './ServiceCardMini.css'; 

function ServiceCardMini({ service }) {
  return (
    
    
    <Link to={`/profile/${service.authorId}`} className="service-card-mini">
      <img src={service.coverImage} alt={service.title} className="service-mini-image" />
      <div className="service-mini-content">
        <p className="service-mini-title">{service.title}</p>
        <div className="service-mini-footer">
          <div className="service-mini-rating">
            <FaStar color="#ffc107" />
            <span>{service.rating.toFixed(1)}</span>
            <span className="review-count-mini">({service.reviewCount})</span>
          </div>
          <p className="service-mini-price">฿{service.price}</p>
        </div>
      </div>
    </Link>
  );
}

export default ServiceCardMini;