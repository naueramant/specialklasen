import type { FunctionComponent } from 'react';
import { Modal } from '../../../../components/Dialog';
import WineKindBadge from '../../../../components/WineKindBadge';
import type { Wine } from '../../../../models/wines';
import { formatDate, formatVintage } from '../../../../utils/format';
import styles from './index.module.scss';

interface WineDetailsModalProps {
  wine: Wine;
  onClose: () => void;
}

const WineDetailsModal: FunctionComponent<WineDetailsModalProps> = ({ wine, onClose }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
    }).format(price);
  };

  const consumedQuantity = wine.quantity - (wine.remaining || 0);
  const consumedPercentage = wine.quantity > 0 ? (consumedQuantity / wine.quantity) * 100 : 0;

  return (
    <Modal title="Om vinen" onClose={onClose} width="wide">
      <div className={styles.wineInfo}>
        {/* set like a bottle label: vintage, name, origin */}
        <div className={styles.label}>
          <span className={styles.vintage}>{formatVintage(wine.year)}</span>
          <h3 className={styles.wineTitle}>{wine.name}</h3>
          <span className={styles.origin}>{[wine.region, wine.country].filter(Boolean).join(', ')}</span>
        </div>

        <div className={styles.wineDetails}>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Type:</span>
            <WineKindBadge kind={wine.kind} />
          </div>

          <div className={styles.detail}>
            <span className={styles.detailLabel}>Druetype:</span>
            <span className={styles.value}>{wine.grape}</span>
          </div>

          <div className={styles.detail}>
            <span className={styles.detailLabel}>Placering:</span>
            <span className={styles.value}>{wine.location}</span>
          </div>

          <div className={styles.detail}>
            <span className={styles.detailLabel}>Købsdato:</span>
            <span className={styles.value}>{formatDate(wine.bought)}</span>
          </div>

          <div className={styles.detail}>
            <span className={styles.detailLabel}>Pris:</span>
            <span className={styles.value}>{wine.price ? formatPrice(wine.price) : '—'}</span>
          </div>
        </div>
      </div>

      <div className={styles.quantitySection}>
        <div className={styles.quantityHeader}>
          <h3>Lager status</h3>
        </div>

        <div className={styles.quantityDetails}>
          <div className={styles.quantityRow}>
            <span className={styles.detailLabel}>Total antal:</span>
            <span className={styles.value}>{wine.quantity}</span>
          </div>

          <div className={styles.quantityRow}>
            <span className={styles.detailLabel}>Tilbage:</span>
            <span className={`${styles.value} ${wine.remaining === 0 ? styles.empty : ''}`}>{wine.remaining !== undefined ? wine.remaining : '-'}</span>
          </div>

          <div className={styles.quantityRow}>
            <span className={styles.detailLabel}>Konsumeret:</span>
            <span className={styles.value}>{consumedQuantity}</span>
          </div>
        </div>

        {wine.quantity > 0 && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${consumedPercentage}%` }} />
            </div>
            <span className={styles.progressText}>{consumedPercentage.toFixed(0)}% konsumeret</span>
          </div>
        )}
      </div>

      {wine.notes && wine.notes.trim() !== '' && (
        <div className={styles.notesSection}>
          <h3>Noter</h3>
          <p className={styles.notes}>{wine.notes}</p>
        </div>
      )}
    </Modal>
  );
};

export default WineDetailsModal;
