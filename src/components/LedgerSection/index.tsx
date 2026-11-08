import type { FunctionComponent } from 'react';
import styles from './index.module.scss';

interface LedgerSectionProps {
  title: React.ReactNode;
  // a short tally shown on the rule opposite the title, e.g. "4 aftener"
  tally?: string;
  children?: React.ReactNode | React.ReactNode[];
}

/*
    A section of the club's ledger: a large Anton heading sitting on a rust rule.
    Used for years in the calendar and the album archive.
*/
const LedgerSection: FunctionComponent<LedgerSectionProps> = ({ title, tally, children }) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {tally && <p className={styles.tally}>{tally}</p>}
      </div>

      {children}
    </section>
  );
};

export default LedgerSection;
