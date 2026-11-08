import type { FunctionComponent } from 'react';
import styles from './index.module.scss';

interface ImpactTextProps {
  children: React.ReactNode;
  // render as a heading when the text titles a page or section
  as?: 'span' | 'h1' | 'h2' | 'h3';
  className?: string;
}

const ImpactText: FunctionComponent<ImpactTextProps> = ({ children, as: Tag = 'span', className }) => {
  return <Tag className={`${styles.impactText} ${className ?? ''}`}>{children}</Tag>;
};

interface BodyTextProps {
  children: React.ReactNode;
}

const BodyText: FunctionComponent<BodyTextProps> = ({ children }) => {
  return <p className={styles.bodyText}>{children}</p>;
};

export { BodyText, ImpactText };
