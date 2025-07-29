import { type FC, type ReactNode } from 'react';
import './pill.scss';

interface PillProps {
  children: ReactNode;
  className?: string;
}

const Pill: FC<PillProps> = ({ children, className = '' }) => {
  return (
    <span className={`pill ${className}`}>
      {children}
    </span>
  );
};

export default Pill;