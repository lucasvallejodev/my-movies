import React from 'react';
import './anchor-button.scss';

interface AnchorButtonProps {
  children: React.ReactNode;
  href: string;
  target?: string;
  rel?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const AnchorButton: React.FC<AnchorButtonProps> = ({
  children,
  href,
  target = '_blank',
  rel = 'noopener noreferrer',
  size = 'medium',
  className = ''
}) => {
  return (
    <a 
      href={href}
      target={target}
      rel={rel}
      className={`anchor-button anchor-button--${size} ${className}`}
    >
      {children}
    </a>
  );
};

export default AnchorButton;