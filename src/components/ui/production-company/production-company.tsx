import React from 'react';
import './production-company.scss';

interface ProductionCompanyProps {
  name: string;
  logoPath?: string;
  originCountry: string;
  logoBaseUrl: string;
  className?: string;
}

const ProductionCompany: React.FC<ProductionCompanyProps> = ({
  name,
  logoPath,
  originCountry,
  logoBaseUrl,
  className = ''
}) => {
  return (
    <div className={`production-company ${className}`}>
      {logoPath && (
        <img 
          src={`${logoBaseUrl}${logoPath}`}
          alt={name}
          className="production-company__logo"
        />
      )}
      <div className="production-company__info">
        <span className="production-company__name">{name}</span>
        <span className="production-company__country">({originCountry})</span>
      </div>
    </div>
  );
};

export default ProductionCompany;