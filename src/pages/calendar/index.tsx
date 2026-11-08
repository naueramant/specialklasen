import { useState, type FunctionComponent } from 'react';
import { IoCalendarOutline } from 'react-icons/io5';
import Card, { CardButton } from '../../components/Card';
import LedgerSection from '../../components/LedgerSection';
import PageIntro from '../../components/PageIntro';
import { ImpactText } from '../../components/Text';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { Event } from '../../models/event';
import { useEvents } from '../../services/api/events';
import { formatDate, formatTime, parseDate, stripClubPrefix } from '../../utils/format';
import AddEventToCalendar from './components/AddEventToCalendarModal';
import styles from './index.module.scss';

type EventState = 'upcoming' | 'tba' | 'past';

interface EventCardProps {
  event: Event;
  state: EventState;
  onAddToCalendar: (event: Event) => void;
}

const EventCard: FunctionComponent<EventCardProps> = ({ event, state, onAddToCalendar }) => {
  const description = <div className={styles.description} dangerouslySetInnerHTML={{ __html: event.description }} />;

  return (
    <Card variant={state === 'past' ? 'outlined' : 'solid'} interactive={state === 'upcoming'}>
      <article className={styles.eventCard}>
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

        <h3 className={styles.eventTitle}>
          {state === 'upcoming' ? <CardButton onClick={() => onAddToCalendar(event)}>{stripClubPrefix(event.title)}</CardButton> : stripClubPrefix(event.title)}
        </h3>

        {event.description &&
          (state === 'past' ? (
            <details className={styles.details}>
              <summary>Læs mere</summary>
              {description}
            </details>
          ) : (
            description
          ))}

        {state === 'upcoming' && (
          <span className={styles.addHint} aria-hidden>
            <IoCalendarOutline /> Tilføj til kalender
          </span>
        )}
      </article>
    </Card>
  );
};

const CalendarPage: FunctionComponent = () => {
  useDocumentTitle('Kalender');
  const { data: events = [], isLoading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
                <EventCard event={nextEvent} state="upcoming" onAddToCalendar={setSelectedEvent} />
              </div>
            </LedgerSection>
          )}

          {tbaEvents.length > 0 && (
            <LedgerSection title="TBA" tally="Dato følger">
              <div className={styles.eventsGrid}>
                {tbaEvents.map((event, index) => (
                  <EventCard key={index} event={event} state="tba" onAddToCalendar={setSelectedEvent} />
                ))}
              </div>
            </LedgerSection>
          )}

          {sortedYears.map((year) => (
            <LedgerSection key={year} title={year} tally={eventsByYear[year].length === 1 ? '1 aften' : `${eventsByYear[year].length} aftener`}>
              <div className={styles.eventsGrid}>
                {eventsByYear[year].map((event, index) => (
                  <EventCard key={index} event={event} state={getState(event)} onAddToCalendar={setSelectedEvent} />
                ))}
              </div>
            </LedgerSection>
          ))}
        </>
      )}

      {selectedEvent && <AddEventToCalendar event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};

export default CalendarPage;
