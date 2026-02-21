import { useState, type FunctionComponent } from 'react';
import { useNavigate } from 'react-router';
import type { RecordModel } from 'pocketbase';
import Card from '../../components/Card';
import { ImpactText } from '../../components/Text';
import type { Event } from '../../models/event';
import { pb } from '../../services/api/client';
import { syncSuperuserAuthToPocketBase } from '../../services/admin/superuserAuth';
import { useEvents } from '../../services/api/events';
import AddEventToCalendar from './components/AddEventToCalendarModal';
import ChooseCoverImageModal from './components/ChooseCoverImageModal';
import { addEventToCalendar } from './components/AddEventToCalendarModal/helper';
import styles from './index.module.scss';

const CalendarPage: FunctionComponent = () => {
  const { data: events = [], refetch } = useEvents();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [coverEvent, setCoverEvent] = useState<Event | null>(null);
  const [showCoverPopup, setShowCoverPopup] = useState(false);
  const [savingCover, setSavingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

  // Separate TBA events (no start date) from dated events
  const tbaEvents = events.filter((event) => !event.startDate);
  const datedEvents = events.filter((event) => !!event.startDate);

  // Group dated events by year
  const eventsByYear = datedEvents.reduce(
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('da-DK', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLocation = (location: string | undefined) => {
    return location ? location.toUpperCase() : '';
  };

  const currentDate = new Date();

  const handleAddToCalendarClick = (event: Event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  };

  const handleViewAlbumClick = (event: Event) => {
    if (!event.album) return;
    navigate(`/albums/${event.album}`);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedEvent(null);
  };

  const handleOpenCoverPicker = (event: Event) => {
    setCoverError(null);
    setCoverEvent(event);
    setShowCoverPopup(true);
  };

  const handleCloseCoverPicker = () => {
    setShowCoverPopup(false);
    setCoverEvent(null);
    setCoverError(null);
  };

  const handleSelectCover = async (fileName: string) => {
    if (!coverEvent?.id) return;

    setSavingCover(true);
    try {
      syncSuperuserAuthToPocketBase(pb);
      await pb.collection('calendar').update(coverEvent.id, { coverFromAlbum: fileName });
      await refetch();
      handleCloseCoverPicker();
    } catch (e: any) {
      const message = typeof e?.message === 'string' ? e.message : 'Kunne ikke gemme coverbillede.';
      setCoverError(message);
    } finally {
      setSavingCover(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!selectedEvent) return;

    addEventToCalendar(selectedEvent);

    handleClosePopup();
  };

  const getCoverImageUrl = (event: Event): string | null => {
    if (event.coverFromAlbum && event.albumExpanded) {
      try {
        return pb.files.getURL(event.albumExpanded as unknown as RecordModel, event.coverFromAlbum);
      } catch {
        // fall through
      }
    }

    if (event.coverImage) {
      try {
        return pb.files.getURL(event as unknown as RecordModel, event.coverImage);
      } catch {
        return null;
      }
    }

    return null;
  };

  const canPickCoverForEvent = (event: Event) => {
    return !!event.album;
  };

  return (
    <div className={styles.calendar}>
      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <ImpactText>Ingen kommende begivenheder</ImpactText>
          <p className={styles.emptyStateText}>Der er i øjeblikket ingen begivenheder planlagt.</p>
        </div>
      ) : (
        <>
          {tbaEvents.length > 0 && (
            <div className={styles.yearSection}>
              <div className={styles.yearHeader}>
                <ImpactText>TBA</ImpactText>
              </div>

              <div className={styles.eventsGrid}>
                {tbaEvents.map((event, index) => {
                  const coverUrl = getCoverImageUrl(event);
                  return (
                    <Card key={index} variant="solid" hover={false} padding={false}>
                      <div className={`${styles.eventCard} ${coverUrl ? styles.hasCover : ''}`}>
                        {coverUrl && (
                          <div className={styles.coverWrap}>
                            <img src={coverUrl} alt={event.title} className={styles.coverImage} />
                          </div>
                        )}

                        <div className={styles.eventContent}>
                          <div className={styles.eventHeader}>
                            <div className={styles.eventDate}>TBA</div>
                            <div className={styles.eventLocation}>{formatLocation(event.location)}</div>
                          </div>

                          <div className={styles.eventTitle}>{event.title}</div>

                          <div
                            dangerouslySetInnerHTML={{
                              __html: event.description,
                            }}
                          />
                        </div>

                        <div className={styles.eventFooter}>
                          <div className={styles.eventActions}>
                            <button type="button" className={styles.coverButton} onClick={() => handleOpenCoverPicker(event)} disabled={!canPickCoverForEvent(event)}>
                              Vælg coverbillede
                            </button>
                            {event.album && (
                              <button
                                type="button"
                                className={styles.albumButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewAlbumClick(event);
                                }}
                              >
                                Se billeder
                              </button>
                            )}
                            <button
                              type="button"
                              className={styles.calendarButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCalendarClick(event);
                              }}
                              disabled={!event.startDate}
                            >
                              Tilføj til kalender
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {sortedYears.map((year) => (
            <div key={year} className={styles.yearSection}>
              <div className={styles.yearHeader}>
                <ImpactText>{year}</ImpactText>
              </div>

              <div className={styles.eventsGrid}>
                {eventsByYear[year]
                  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                  .map((event, index) => {
                    const isFutureEvent = new Date(event.startDate) > currentDate;
                    const coverUrl = getCoverImageUrl(event);
                    return (
                      <Card key={index} variant={isFutureEvent ? 'solid' : 'outlined'} hover={false} padding={false}>
                        <div className={`${styles.eventCard} ${coverUrl ? styles.hasCover : ''}`}>
                          {coverUrl && (
                            <div className={styles.coverWrap}>
                              <img src={coverUrl} alt={event.title} className={styles.coverImage} />
                            </div>
                          )}

                          <div className={styles.eventContent}>
                            <div className={styles.eventHeader}>
                              <div className={styles.eventDate}>{formatDate(new Date(event.startDate))}</div>
                              <div className={styles.eventLocation}>{formatLocation(event.location)}</div>
                            </div>

                            <div className={styles.eventTitle}>{event.title}</div>

                            <div
                              dangerouslySetInnerHTML={{
                                __html: event.description,
                              }}
                            />
                          </div>

                          <div className={styles.eventFooter}>
                            <div className={styles.eventActions}>
                              <button type="button" className={styles.coverButton} onClick={() => handleOpenCoverPicker(event)} disabled={!canPickCoverForEvent(event)}>
                                Vælg coverbillede
                              </button>
                              {event.album && (
                                <button
                                  type="button"
                                  className={styles.albumButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewAlbumClick(event);
                                  }}
                                >
                                  Se billeder
                                </button>
                              )}
                              <button
                                type="button"
                                className={styles.calendarButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCalendarClick(event);
                                }}
                                disabled={!event.startDate}
                              >
                                Tilføj til kalender
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </>
      )}

      {selectedEvent && <AddEventToCalendar event={selectedEvent} isOpen={showPopup} onClose={handleClosePopup} onConfirm={handleAddToCalendar} />}

      {coverEvent && (
        <ChooseCoverImageModal
          event={coverEvent}
          isOpen={showCoverPopup}
          isSaving={savingCover}
          errorMessage={coverError}
          onClose={handleCloseCoverPicker}
          onSelect={handleSelectCover}
        />
      )}
    </div>
  );
};

export default CalendarPage;
