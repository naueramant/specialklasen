import type { FunctionComponent } from "react";
import Card from "../../components/Card";
import { BodyText, ImpactText } from "../../components/Text";
import styles from "./index.module.scss";

interface Event {
  title: string;
  description: string;
  location: string;
  date: Date;
}

// Sample events data - you can replace this with your actual data source
const events: Event[] = [
  {
    title: "Arbor Day Celebration",
    description:
      "The City of Brookhaven celebrates Arbor Day by planting trees in Georgian Hills Park, located at 2800 East Georgian Drive, on Saturday, March 12, from 10 a.m. to noon.",
    location: "Georgian Hills Park, Brookhaven, GA",
    date: new Date(2024, 2, 12), // March 12, 2024
  },
  {
    title: "Cherry Blossom Festival",
    description:
      "This 3-day celebration of Brookhaven, GA and its blooms include musical performances, an arts and crafts market, children's village, 5K run/walk, 1K walk and pet parade.",
    location: "Downtown Brookhaven, GA",
    date: new Date(2024, 3, 2), // April 2, 2024
  },
  {
    title: "Brookhaven Beer Festival",
    description:
      "Over 100 import & craft beers plus a great selection of breweries along with great entertainment.",
    location: "Brookhaven Park",
    date: new Date(2024, 5, 11), // June 11, 2024
  },
  {
    title: "Summer Wine Tasting",
    description:
      "Join us for an exclusive wine tasting event featuring selections from our private cellar. Perfect for wine enthusiasts and newcomers alike.",
    location: "Special Klasen Venue",
    date: new Date(2025, 6, 15), // July 15, 2025
  },
  {
    title: "Annual Harvest Celebration",
    description:
      "Celebrate the autumn harvest with us. Featuring seasonal wines, live music, and gourmet food pairings in a beautiful outdoor setting.",
    location: "Special Klasen Gardens",
    date: new Date(2025, 11, 12), // December 12, 2025
  },
];

const CalendarPage: FunctionComponent = () => {
  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = event.date.getFullYear();
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

  const formatLocation = (location: string) => {
    return location.toUpperCase();
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
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((event, index) => {
                const isFutureEvent = event.date > currentDate;
                return (
                  <Card
                    key={index}
                    variant={isFutureEvent ? "solid" : "outlined"}
                  >
                    <div className={styles.eventCard}>
                      <div className={styles.eventHeader}>
                        <div className={styles.eventDate}>
                          {formatDate(event.date)}
                        </div>
                        <div className={styles.eventLocation}>
                          {formatLocation(event.location)}
                        </div>
                      </div>

                      <div className={styles.eventTitle}>{event.title}</div>

                      <BodyText>{event.description}</BodyText>
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
