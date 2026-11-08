import type { Event } from '../../../../models/event';

const toCalendarTimestamp = (date: Date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');

// Events without an end date are treated as three hours long
const getEventDates = (event: Event) => {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
  return { startDate, endDate };
};

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').trim();
};

export const addEventToCalendar = (event: Event) => {
  const { startDate, endDate } = getEventDates(event);

  const start = encodeURIComponent(toCalendarTimestamp(startDate));
  const end = encodeURIComponent(toCalendarTimestamp(endDate));
  const title = encodeURIComponent(event.title);
  const description = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(event.location || '');

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${description}&location=${location}&sf=true&output=xml`;

  window.open(url, '_blank');
};

// Escape text values as required by RFC 5545
const escapeIcsText = (value: string) => value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

export const downloadEventIcs = (event: Event) => {
  const { startDate, endDate } = getEventDates(event);

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Specialklasen//Kalender//DA',
    'BEGIN:VEVENT',
    `UID:${toCalendarTimestamp(startDate)}-${encodeURIComponent(event.title)}@specialklasen.org`,
    `DTSTAMP:${toCalendarTimestamp(new Date())}`,
    `DTSTART:${toCalendarTimestamp(startDate)}`,
    `DTEND:${toCalendarTimestamp(endDate)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : '',
    event.description ? `DESCRIPTION:${escapeIcsText(stripHtml(event.description))}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^\p{L}\p{N}]+/gu, '-').toLowerCase()}.ics`;
  link.click();
  URL.revokeObjectURL(url);
};
