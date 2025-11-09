import type { FunctionComponent } from "react";
import Card from "../../components/Card";
import { ImpactText } from "../../components/Text";
import type { Event } from "../../models/event";
import { useEvents } from "../../services/api/events";
import styles from "./index.module.scss";

const CalendarPage: FunctionComponent = () => {
  const { data: events = [] } = useEvents();

  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear();
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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatLocation = (location: string | undefined) => {
    return location ? location.toUpperCase() : "";
  };

  const currentDate = new Date();

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
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((event, index) => {
                const isFutureEvent = new Date(event.date) > currentDate;
                return (
                  <Card
                    key={index}
                    variant={isFutureEvent ? "solid" : "outlined"}
                  >
                    <div className={styles.eventCard}>
                      <div className={styles.eventHeader}>
                        <div className={styles.eventDate}>
                          {formatDate(new Date(event.date))}
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
    </div>
  );
};

export default CalendarPage;
