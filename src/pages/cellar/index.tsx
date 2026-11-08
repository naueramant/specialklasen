import { useState, type FunctionComponent } from 'react';
import LedgerSection from '../../components/LedgerSection';
import PageIntro from '../../components/PageIntro';
import { ImpactText } from '../../components/Text';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useWines } from '../../services/api/wines';
import Holders from './components/Holders';
import WineTable from './components/WineTable';
import styles from './index.module.scss';

const CellarPage: FunctionComponent = () => {
  useDocumentTitle('Kælderen');
  const { data: wines, isLoading, error } = useWines();
  const [holder, setHolder] = useState<string | null>(null);

  const remainingWines = wines?.reduce((total, wine) => total + (wine.remaining ?? 0), 0);

  const drunkWines = wines?.reduce((total, wine) => total + (wine.remaining !== undefined ? wine.quantity - wine.remaining : 0), 0);

  if (isLoading) {
    return <p className={styles.status}>Henter vinene fra kælderen…</p>;
  }

  if (error) {
    return <p className={styles.status}>Kælderen kunne ikke hentes. Prøv at genindlæse siden.</p>;
  }

  if (!wines || wines.length === 0) {
    return (
      <div className={styles.emptyState}>
        <ImpactText as="h1">Ingen vine i kælderen</ImpactText>
        <p className={styles.emptyStateText}>Fuck det er fattigt 💸</p>
      </div>
    );
  }

  return (
    <>
      <PageIntro title="Kælderen">
        <p>
          Vi har i øjeblikket {remainingWines} vine i vores kælder og {drunkWines} vine er blevet konsumeret 🎉
        </p>
      </PageIntro>

      <LedgerSection title="Hvem har hvad">
        <Holders wines={wines} selected={holder} onSelect={setHolder} />
      </LedgerSection>

      <LedgerSection title="Hele kælderen" tally={wines.length === 1 ? '1 vin' : `${wines.length} vine`}>
        <WineTable wines={wines} holder={holder} onClearHolder={() => setHolder(null)} />
      </LedgerSection>
    </>
  );
};

export default CellarPage;
