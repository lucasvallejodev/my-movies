import React from 'react';
import './rating.scss';

interface RatingProps {
  rating: number;
  votes?: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ rating, votes, className = '' }) => {
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className={`rating ${className}`}>
      <span className="star">★</span>
      <span className="rating-value">{roundedRating}</span>
      {votes && (
        <span className="vote-count">({votes} votes)</span>
      )}
    </div>
  );
};

export default Rating;