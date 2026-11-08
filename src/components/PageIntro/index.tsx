import type { FunctionComponent } from 'react';
import styles from './index.module.scss';

interface PageIntroProps {
  title: string;
  children?: React.ReactNode;
}

// The big Anton page title with a line of copy underneath, as on the home page
const PageIntro: FunctionComponent<PageIntroProps> = ({ title, children }) => {
  return (
    <header className={styles.intro}>
      <h1 className={styles.title}>{title}</h1>
      {children && <div className={styles.lede}>{children}</div>}
    </header>
  );
};

export default PageIntro;
