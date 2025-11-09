import type { FunctionComponent } from "react";
import type { Wine } from "../../../../models/wines";
import styles from "./index.module.scss";

interface WineDetailsModalProps {
  wine: Wine;
  isOpen: boolean;
  onClose: () => void;
}

const WineDetailsModal: FunctionComponent<WineDetailsModalProps> = ({
  wine,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("da-DK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: "DKK",
    }).format(price);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const consumedQuantity = wine.quantity - (wine.remaining || 0);
  const consumedPercentage =
    wine.quantity > 0 ? (consumedQuantity / wine.quantity) * 100 : 0;

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>Vin Detaljer</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.wineInfo}>
            <h3 className={styles.wineTitle}>
              {wine.name}
              <span className={styles.year}>{wine.year}</span>
            </h3>

            <div className={styles.wineDetails}>
              <div className={styles.detail}>
                <span className={styles.label}>Type:</span>
                <span
                  className={`${styles.kindBadge} ${
                    styles[wine.kind.toLowerCase()]
                  }`}
                >
                  {wine.kind}
                </span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Land:</span>
                <span className={styles.value}>{wine.country}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Region:</span>
                <span className={styles.value}>{wine.region}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Druetype:</span>
                <span className={styles.value}>{wine.grape}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Placering:</span>
                <span className={styles.value}>{wine.location}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Købsdato:</span>
                <span className={styles.value}>{formatDate(wine.bought)}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Pris:</span>
                <span className={styles.value}>{formatPrice(wine.price)}</span>
              </div>
            </div>
          </div>

          <div className={styles.quantitySection}>
            <div className={styles.quantityHeader}>
              <h3>Lager status</h3>
            </div>

            <div className={styles.quantityDetails}>
              <div className={styles.quantityRow}>
                <span className={styles.label}>Total antal:</span>
                <span className={styles.value}>{wine.quantity}</span>
              </div>

              <div className={styles.quantityRow}>
                <span className={styles.label}>Tilbage:</span>
                <span
                  className={`${styles.value} ${
                    wine.remaining === 0 ? styles.empty : ""
                  }`}
                >
                  {wine.remaining !== undefined ? wine.remaining : "-"}
                </span>
              </div>

              <div className={styles.quantityRow}>
                <span className={styles.label}>Konsumeret:</span>
                <span className={styles.value}>{consumedQuantity}</span>
              </div>
            </div>

            {wine.quantity > 0 && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${consumedPercentage}%` }}
                  />
                </div>
                <span className={styles.progressText}>
                  {consumedPercentage.toFixed(0)}% konsumeret
                </span>
              </div>
            )}
          </div>

          {wine.notes && wine.notes.trim() !== "" && (
            <div className={styles.notesSection}>
              <h3>Noter</h3>
              <p className={styles.notes}>{wine.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WineDetailsModal;
