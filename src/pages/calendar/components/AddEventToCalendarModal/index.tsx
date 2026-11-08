import type { FunctionComponent } from 'react';
import { Modal } from '../../../../components/Dialog';
import type { Event } from '../../../../models/event';
import { formatDate, formatTime, stripClubPrefix } from '../../../../utils/format';
import { addEventToCalendar, downloadEventIcs } from './helper';
import styles from './index.module.scss';

interface AddEventToCalendarProps {
  event: Event;
  onClose: () => void;
}

const AddEventToCalendar: FunctionComponent<AddEventToCalendarProps> = ({ event, onClose }) => {
  const handleGoogle = () => {
    addEventToCalendar(event);
    onClose();
  };

  const handleIcs = () => {
    downloadEventIcs(event);
    onClose();
  };

  const endTime = formatTime(event.endDate);

  return (
    <Modal title="Tilføj til kalender" onClose={onClose}>
      <div className={styles.eventInfo}>
        <h3 className={styles.eventTitle}>{stripClubPrefix(event.title)}</h3>

        <dl className={styles.eventDetails}>
          <div className={styles.detail}>
            <dt className={styles.label}>Dato</dt>
            <dd>{formatDate(event.startDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</dd>
          </div>

          <div className={styles.detail}>
            <dt className={styles.label}>Tid</dt>
            <dd>
              {formatTime(event.startDate)}
              {endTime && ` – ${endTime}`}
            </dd>
          </div>

          {event.location && (
            <div className={styles.detail}>
              <dt className={styles.label}>Sted</dt>
              <dd>{event.location}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={handleIcs}>
          Hent .ics-fil
        </button>
        <button type="button" className={styles.primaryButton} onClick={handleGoogle}>
          Google Kalender
        </button>
      </div>
    </Modal>
  );
};

export default AddEventToCalendar;
