import type { FunctionComponent } from 'react';
import { BodyText, ImpactText } from '../../components/Text';
import { useWines } from '../../services/api/wines';
import WineTable from './components/WineTable';
import styles from './index.module.scss';

const CellarPage: FunctionComponent = () => {
  const { data: wines } = useWines();

  const remainingWines = wines?.reduce((total, wine) => total + wine.quantity, 0);

  const drunkWines = wines?.reduce((total, wine) => total + (wine.remaining !== undefined ? wine.quantity - wine.remaining : 0), 0);

  if (!wines || wines.length === 0) {
    return (
      <div className={styles.emptyState}>
        <ImpactText>Ingen vine i kælderen</ImpactText>
        <p className={styles.emptyStateText}>Der er i øjeblikket ingen vine i kælderen.</p>
      </div>
    );
  }

  return (
    <>
      <BodyText>
        Vi har i øjeblikket {remainingWines} vine i vores kælder og {drunkWines} vine er blevet konsumeret 🎉
      </BodyText>

      <WineTable wines={wines} />
    </>
  );
};

export default CellarPage;
