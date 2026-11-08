import type { FunctionComponent } from 'react';
import Card from '../../components/Card';
import LedgerSection from '../../components/LedgerSection';
import PageIntro from '../../components/PageIntro';
import { BOARD_TERMS } from '../../data/board';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/format';
import styles from './index.module.scss';

const BoardPage: FunctionComponent = () => {
  useDocumentTitle('Bestyrelsen');

  return (
    <>
      <PageIntro title="Bestyrelsen">
        <p>Hvem har siddet på hvilken post. Bestyrelsen vælges på generalforsamlingen.</p>
      </PageIntro>

      {BOARD_TERMS.map((term) => (
        <LedgerSection key={term.year} title={term.year} tally={`Valgt ${formatDate(term.elected, { day: 'numeric', month: 'short', year: 'numeric' })}`}>
          <ul className={styles.posts}>
            {term.posts.map((post) => (
              <li key={post.post}>
                <Card className={styles.post}>
                  <span className={styles.postName}>{post.post}</span>
                  <span className={styles.member}>{post.name}</span>
                  {post.title && <span className={styles.title}>»{post.title}«</span>}
                </Card>
              </li>
            ))}
          </ul>
        </LedgerSection>
      ))}
    </>
  );
};

export default BoardPage;
