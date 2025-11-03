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
    title: "Træplantningsdag",
    description:
      "Byen Brookhaven fejrer Træplantningsdag ved at plante træer i Georgian Hills Park, beliggende på 2800 East Georgian Drive, lørdag den 12. marts fra kl. 10 til 12.",
    location: "Georgian Hills Park, Brookhaven, GA",
    date: new Date(2024, 2, 12), // 12. marts 2024
  },
  {
    title: "Kirsebærblomsterfestival",
    description:
      "Denne 3-dages fejring af Brookhaven, GA og dens blomster inkluderer musikopførelser, et kunsthåndværksmarked, børneby, 5K løb/gå, 1K gå og kæledyrsparade.",
    location: "Downtown Brookhaven, GA",
    date: new Date(2024, 3, 2), // 2. april 2024
  },
  {
    title: "Brookhaven Ølfestival",
    description:
      "Over 100 import- og håndværksøl samt et fantastisk udvalg af bryggerier sammen med god underholdning.",
    location: "Brookhaven Park",
    date: new Date(2024, 5, 11), // 11. juni 2024
  },
  {
    title: "Sommer Vinsmagning",
    description:
      "Deltag i vores eksklusive vinsmagningsbegivenhed med udvalg fra vores private kælder. Perfekt for vinentusiaster og nybegyndere.",
    location: "Special Klasen Venue",
    date: new Date(2025, 6, 15), // 15. juli 2025
  },
  {
    title: "Årlig Høstfest",
    description:
      "Fejr efterårets høst med os. Med sæsonvine, livemusik og gourmetmad i smukke udendørs omgivelser.",
    location: "Special Klasen Gardens",
    date: new Date(2025, 11, 12), // 12. december 2025
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
