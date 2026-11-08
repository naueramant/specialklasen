import { useState, type FunctionComponent } from 'react';
import { IoCalendarOutline, IoImagesOutline } from 'react-icons/io5';
import { Link } from 'react-router';
import type { RecordModel } from 'pocketbase';
import Card from '../../components/Card';
import LedgerSection from '../../components/LedgerSection';
import PageIntro from '../../components/PageIntro';
import { ImpactText } from '../../components/Text';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { Event } from '../../models/event';
import { isLoggedInAsAdmin } from '../../services/admin/user';
import { syncSuperuserAuthToPocketBase } from '../../services/admin/superuserAuth';
import { pb } from '../../services/api/client';
import { useEvents } from '../../services/api/events';
import { formatDate, formatTime, parseDate, stripClubPrefix } from '../../utils/format';
import AddEventToCalendar from './components/AddEventToCalendarModal';
import ChooseCoverImageModal from './components/ChooseCoverImageModal';
import styles from './index.module.scss';

type EventState = 'upcoming' | 'tba' | 'past';

// A cover picked from the linked album wins over an uploaded cover image
const getCoverImageUrl = (event: Event): string | null => {
  if (event.coverFromAlbum && event.albumExpanded) {
    return pb.files.getURL(event.albumExpanded as unknown as RecordModel, event.coverFromAlbum, { thumb: '800x0' });
  }

  if (event.coverImage) {
    return pb.files.getURL(event as unknown as RecordModel, event.coverImage);
  }

  return null;
};

interface EventCardProps {
  event: Event;
  state: EventState;
  canPickCover: boolean;
  onAddToCalendar: (event: Event) => void;
  onPickCover: (event: Event) => void;
}

const EventCard: FunctionComponent<EventCardProps> = ({ event, state, canPickCover, onAddToCalendar, onPickCover }) => {
  const description = <div className={styles.description} dangerouslySetInnerHTML={{ __html: event.description }} />;
  const coverUrl = getCoverImageUrl(event);
  const showCoverPicker = canPickCover && !!event.album;
  const hasActions = !!event.album || state === 'upcoming' || showCoverPicker;

  return (
    <Card variant={state === 'past' ? 'outlined' : 'solid'} className={styles.card}>
      <article className={styles.eventCard}>
        {coverUrl && (
          <div className={styles.coverWrap}>
            <img src={coverUrl} alt="" className={styles.coverImage} loading="lazy" decoding="async" />
          </div>
        )}

        <div className={styles.eventContent}>
          <div className={styles.eventHeader}>
            <div>
              <div className={styles.eventDate}>{state === 'tba' ? 'TBA' : formatDate(event.startDate, { month: 'short', day: 'numeric' })}</div>
              {state !== 'tba' && (
                <div className={styles.eventWhen}>
                  {formatDate(event.startDate, { weekday: 'long' })} · {formatTime(event.startDate)}
                </div>
              )}
            </div>
            {event.location && <div className={styles.eventLocation}>{event.location}</div>}
          </div>

          <h3 className={styles.eventTitle}>{stripClubPrefix(event.title)}</h3>

          {event.description &&
            (state === 'past' ? (
              <details className={styles.details}>
                <summary>Læs mere</summary>
                {description}
              </details>
            ) : (
              description
            ))}
        </div>

        {hasActions && (
          <div className={styles.eventActions}>
            {showCoverPicker && (
              <button type="button" className={styles.actionButton} onClick={() => onPickCover(event)}>
                Vælg coverbillede
              </button>
            )}
            {event.album && (
              <Link to={`/albums/${event.album}`} className={styles.actionButton}>
                <IoImagesOutline aria-hidden /> Se billeder
              </Link>
            )}
            {state === 'upcoming' && (
              <button type="button" className={`${styles.actionButton} ${styles.primaryAction}`} onClick={() => onAddToCalendar(event)}>
                <IoCalendarOutline aria-hidden /> Tilføj til kalender
              </button>
            )}
          </div>
        )}
      </article>
    </Card>
  );
};

const CalendarPage: FunctionComponent = () => {
  useDocumentTitle('Kalender');
  const { data: events = [], isLoading, error, refetch } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [coverEvent, setCoverEvent] = useState<Event | null>(null);
  const [savingCover, setSavingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const canPickCover = isLoggedInAsAdmin();

  const handleOpenCoverPicker = (event: Event) => {
    setCoverError(null);
    setCoverEvent(event);
  };

  const handleSelectCover = async (fileName: string) => {
    if (!coverEvent?.id) return;

    setSavingCover(true);
    try {
      syncSuperuserAuthToPocketBase(pb);
      await pb.collection('calendar').update(coverEvent.id, { coverFromAlbum: fileName });
      await refetch();
      setCoverEvent(null);
    } catch (e: unknown) {
      setCoverError(e instanceof Error ? e.message : 'Kunne ikke gemme coverbillede.');
    } finally {
      setSavingCover(false);
    }
  };

  const currentDate = new Date();
  const startOf = (event: Event) => parseDate(event.startDate)?.getTime() ?? 0;

  // Separate TBA events (no start date) from dated events
  const tbaEvents = events.filter((event) => !parseDate(event.startDate));
  const datedEvents = events.filter((event) => !!parseDate(event.startDate)).sort((a, b) => startOf(a) - startOf(b));

  // The soonest upcoming event leads the page
  const nextEvent = datedEvents.find((event) => startOf(event) > currentDate.getTime());

  // Group the remaining dated events by year
  const eventsByYear = datedEvents
    .filter((event) => event !== nextEvent)
    .reduce(
      (acc, event) => {
        const year = new Date(event.startDate).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(event);
        return acc;
      },
      {} as Record<number, Event[]>
    );

  // Sort years in descending order
  const sortedYears = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const getState = (event: Event): EventState => (startOf(event) > currentDate.getTime() ? 'upcoming' : 'past');

  if (isLoading) {
    return <p className={styles.status}>Henter begivenheder…</p>;
  }

  if (error) {
    return <p className={styles.status}>Kalenderen kunne ikke hentes. Prøv at genindlæse siden.</p>;
  }

  return (
    <div className={styles.calendar}>
      <PageIntro title="Kalender">
        <p>
          {nextEvent
            ? `Næste gang: ${stripClubPrefix(nextEvent.title)}, ${formatDate(nextEvent.startDate, { weekday: 'long', day: 'numeric', month: 'long' })}.`
            : tbaEvents.length > 0
              ? `Ingen dato i kalenderen lige nu, men ${tbaEvents.length === 1 ? 'én aften' : `${tbaEvents.length} aftener`} er på tegnebrættet.`
              : 'Ingen dato i kalenderen lige nu.'}
        </p>
      </PageIntro>

      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <ImpactText as="h2">Ingen kommende begivenheder</ImpactText>
          <p className={styles.emptyStateText}>Der er i øjeblikket ingen begivenheder planlagt.</p>
        </div>
      ) : (
        <>
          {nextEvent && (
            <LedgerSection title="Næste gang">
              <div className={styles.eventsGrid}>
                <EventCard event={nextEvent} state="upcoming" canPickCover={canPickCover} onAddToCalendar={setSelectedEvent} onPickCover={handleOpenCoverPicker} />
              </div>
            </LedgerSection>
          )}

          {tbaEvents.length > 0 && (
            <LedgerSection title="TBA" tally="Dato følger">
              <div className={styles.eventsGrid}>
                {tbaEvents.map((event, index) => (
                  <EventCard key={index} event={event} state="tba" canPickCover={canPickCover} onAddToCalendar={setSelectedEvent} onPickCover={handleOpenCoverPicker} />
                ))}
              </div>
            </LedgerSection>
          )}

          {sortedYears.map((year) => (
            <LedgerSection key={year} title={year} tally={eventsByYear[year].length === 1 ? '1 aften' : `${eventsByYear[year].length} aftener`}>
              <div className={styles.eventsGrid}>
                {eventsByYear[year].map((event, index) => (
                  <EventCard key={index} event={event} state={getState(event)} canPickCover={canPickCover} onAddToCalendar={setSelectedEvent} onPickCover={handleOpenCoverPicker} />
                ))}
              </div>
            </LedgerSection>
          ))}
        </>
      )}

      {selectedEvent && <AddEventToCalendar event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      {coverEvent && (
        <ChooseCoverImageModal event={coverEvent} isOpen isSaving={savingCover} errorMessage={coverError} onClose={() => setCoverEvent(null)} onSelect={handleSelectCover} />
      )}
    </div>
  );
};

export default CalendarPage;
