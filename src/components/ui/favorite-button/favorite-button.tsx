import React from 'react';
import './favorite-button.scss';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  addText?: string;
  removeText?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  size = 'medium',
  className = '',
  addText = 'Add to Favorites',
  removeText = 'Remove from Favorites'
}) => {
  return (
    <button 
      className={`favorite-button favorite-button--${size} ${isFavorite ? 'favorite-button--remove' : 'favorite-button--add'} ${className}`}
      onClick={onToggle}
    >
      {isFavorite ? removeText : addText}
    </button>
  );
};

export default FavoriteButton;