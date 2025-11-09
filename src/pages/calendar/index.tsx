import { useState, type FunctionComponent } from "react";
import Card from "../../components/Card";
import { ImpactText } from "../../components/Text";
import type { Event } from "../../models/event";
import { useEvents } from "../../services/api/events";
import AddEventToCalendar from "./components/AddEventToCalendarModal";
import { addEventToCalendar } from "./components/AddEventToCalendarModal/helper";
import styles from "./index.module.scss";

const CalendarPage: FunctionComponent = () => {
  const { data: events = [] } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.startDate).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, Event[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("da-DK", {
      month: "short",
      day: "numeric",
    });
  };

  const formatLocation = (location: string | undefined) => {
    return location ? location.toUpperCase() : "";
  };

  const currentDate = new Date();

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedEvent(null);
  };

  const handleAddToCalendar = () => {
    if (!selectedEvent) return;

    addEventToCalendar(selectedEvent);

    handleClosePopup();
  };

  return (
    <div className={styles.calendar}>
      {sortedYears.map((year) => (
        <div key={year} className={styles.yearSection}>
          <div className={styles.yearHeader}>
            <ImpactText>{year}</ImpactText>
          </div>

          <div className={styles.eventsGrid}>
            {eventsByYear[year]
              .sort(
                (a, b) =>
                  new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
              )
              .map((event, index) => {
                const isFutureEvent = new Date(event.startDate) > currentDate;
                return (
                  <Card
                    key={index}
                    variant={isFutureEvent ? "solid" : "outlined"}
                  >
                    <div
                      className={styles.eventCard}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className={styles.eventHeader}>
                        <div className={styles.eventDate}>
                          {formatDate(new Date(event.startDate))}
                        </div>
                        <div className={styles.eventLocation}>
                          {formatLocation(event.location)}
                        </div>
                      </div>

                      <div className={styles.eventTitle}>{event.title}</div>

                      <div
                        dangerouslySetInnerHTML={{ __html: event.description }}
                      />
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}

      {selectedEvent && (
        <AddEventToCalendar
          event={selectedEvent}
          isOpen={showPopup}
          onClose={handleClosePopup}
          onConfirm={handleAddToCalendar}
        />
      )}
    </div>
  );
};

export default CalendarPage;
