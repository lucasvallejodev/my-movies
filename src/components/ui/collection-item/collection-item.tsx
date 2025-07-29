import React from 'react';
import './collection-item.scss';

interface CollectionItemProps {
  name: string;
  posterPath?: string;
  logoBaseUrl: string;
  className?: string;
}

const CollectionItem: React.FC<CollectionItemProps> = ({
  name,
  posterPath,
  logoBaseUrl,
  className = ''
}) => {
  return (
    <div className={`collection-item ${className}`}>
      {posterPath && (
        <img 
          src={`${logoBaseUrl}${posterPath}`}
          alt={name}
          className="collection-item__poster"
        />
      )}
      <span className="collection-item__name">{name}</span>
    </div>
  );
};

export default CollectionItem;