import type { FunctionComponent } from 'react';
import styles from './index.module.scss';

interface CardProps {
  children?: React.ReactNode | React.ReactNode[];
  variant?: 'solid' | 'outlined';
  className?: string;
}

const Card: FunctionComponent<CardProps> = ({ children, variant = 'solid', className }) => {
  return <div className={`${styles.card} ${variant === 'outlined' ? styles.outlined : ''} ${className ?? ''}`}>{children}</div>;
};

export default Card;
