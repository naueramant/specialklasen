import type { FunctionComponent } from 'react';
import styles from './index.module.scss';

interface CardProps {
  children?: React.ReactNode | React.ReactNode[];
  variant?: 'solid' | 'outlined';
  hover?: boolean;
}

const Card: FunctionComponent<CardProps> = ({ children, variant = 'solid', hover = true }) => {
  return <div className={`${styles.card} ${variant === 'outlined' ? styles.outlined : ''} ${hover ? '' : styles.noHover}`}>{children}</div>;
};

export default Card;
