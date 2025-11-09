import type { Event } from "../../../../models/event";

export const addEventToCalendar = (event: Event) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const start = encodeURIComponent(
    startDate.toISOString().replace(/-|:|\.\d{3}/g, "")
  );
  const end = encodeURIComponent(
    endDate.toISOString().replace(/-|:|\.\d{3}/g, "")
  );
  const title = encodeURIComponent(event.title);
  const description = encodeURIComponent(event.description || "");
  const location = encodeURIComponent(event.location || "");

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${description}&location=${location}&sf=true&output=xml`;

  window.open(url, "_blank");
};
