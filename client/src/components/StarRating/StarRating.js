// StarRating.js
import React from "react";
import './StarRating.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    const fullStars = Math.floor(roundedRating); // Number of full stars
    const hasHalfStar = roundedRating % 1 !== 0; // Check for half star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining stars

    return (
      <div className="star-rating">
        {/* Render Full Stars */}
        {Array(fullStars)
          .fill()
          .map((_, index) => (
            <FaStar key={`full-${index}`} className="star" />
          ))}
        {/* Render Half Star */}
        {hasHalfStar && <FaStarHalfAlt className="star" />}
        {/* Render Empty Stars */}
        {Array(emptyStars)
          .fill()
          .map((_, index) => (
            <FaRegStar key={`empty-${index}`} className="star" />
          ))}
        {/* Display Numeric Rating 
        <span className="rating-text">{roundedRating}</span>*/}
      </div>
    );
};

export default StarRating;
