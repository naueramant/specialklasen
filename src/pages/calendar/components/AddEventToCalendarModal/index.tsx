import type { FunctionComponent } from "react";
import type { Event } from "../../../../models/event";
import styles from "./index.module.scss";

interface AddEventToCalendarProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AddEventToCalendar: FunctionComponent<AddEventToCalendarProps> = ({
  event,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("da-DK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tilføj til kalender</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.eventInfo}>
            <h3 className={styles.eventTitle}>{event.title}</h3>

            <div className={styles.eventDetails}>
              <div className={styles.detail}>
                <span className={styles.label}>Dato:</span>
                <span>{formatDate(event.startDate)}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Tid:</span>
                <span>
                  {formatTime(event.startDate)}
                  {event.endDate && ` - ${formatTime(event.endDate)}`}
                </span>
              </div>

              {event.location && (
                <div className={styles.detail}>
                  <span className={styles.label}>Sted:</span>
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          <p className={styles.question}>
            Vil du tilføje denne begivenhed til din kalender?
          </p>

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Annuller
            </button>
            <button className={styles.confirmButton} onClick={onConfirm}>
              Tilføj til kalender
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventToCalendar;
