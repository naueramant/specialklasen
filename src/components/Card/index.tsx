import type { FunctionComponent } from 'react';
import styles from './index.module.scss';

interface CardProps {
  children?: React.ReactNode | React.ReactNode[];
  variant?: 'solid' | 'outlined';
  // the card contains a stretched button or link that makes the whole card clickable
  interactive?: boolean;
  className?: string;
}

const Card: FunctionComponent<CardProps> = ({ children, variant = 'solid', interactive = false, className }) => {
  const classes = [styles.card, variant === 'outlined' ? styles.outlined : '', interactive ? styles.interactive : '', className ?? ''].join(' ');

  return <div className={classes}>{children}</div>;
};

/*
    A button whose hit area covers the nearest interactive Card, so the whole card
    is clickable while only the title is announced and focusable.
*/
const CardButton: FunctionComponent<{ children: React.ReactNode; onClick: () => void; className?: string }> = ({ children, onClick, className }) => {
  return (
    <button type="button" className={`${styles.cardButton} ${className ?? ''}`} onClick={onClick}>
      {children}
    </button>
  );
};

export { CardButton };
export default Card;
