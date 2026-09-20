/**
 * Calendar Utilities for Core & Fit Studio
 * Supports Apple Calendar (.ics file generation) and Google Calendar web link creation.
 */

export interface CalendarEventData {
  title: string;
  description: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "17:30 - 18:30" or "17:30"
}

function parseDateTime(dateStr: string, timeSlot: string): { startIso: string; endIso: string; startIcs: string; endIcs: string } {
  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10) || new Date().getFullYear();
  const month = parseInt(parts[1], 10) - 1 || 0;
  const day = parseInt(parts[2], 10) || 1;

  const times = timeSlot.replace(/\./g, ":").match(/\d{1,2}:\d{2}/g);
  let startH = 17;
  let startM = 30;
  let endH = 18;
  let endM = 30;

  if (times && times.length > 0) {
    const [sh, sm] = times[0].split(":").map(Number);
    startH = sh;
    startM = sm;
    if (times.length > 1) {
      const [eh, em] = times[1].split(":").map(Number);
      endH = eh;
      endM = em;
    } else {
      endH = startH + 1;
      endM = startM;
    }
  }

  const startDate = new Date(year, month, day, startH, startM);
  const endDate = new Date(year, month, day, endH, endM);

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  return {
    startIso: startDate.toISOString(),
    endIso: endDate.toISOString(),
    startIcs: formatIcsDate(startDate),
    endIcs: formatIcsDate(endDate),
  };
}

/**
 * Downloads a .ics file that opens in Apple Calendar (iOS/macOS), Outlook, or Google Calendar
 */
export function downloadIcsFile(event: CalendarEventData) {
  const { startIcs, endIcs } = parseDateTime(event.startDate, event.timeSlot);

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Core & Fit Studio//Member Portal//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:cf-sess-${Date.now()}@coreandfit.com`,
    `DTSTAMP:${startIcs}`,
    `DTSTART:${startIcs}`,
    `DTEND:${endIcs}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Core & Fit Seans Hatırlatması (2 Saat Kaldı)",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `CoreFit_Seans_${event.startDate}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generates a Google Calendar web link
 */
export function generateGoogleCalendarUrl(event: CalendarEventData): string {
  const { startIcs, endIcs } = parseDateTime(event.startDate, event.timeSlot);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startIcs}/${endIcs}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
