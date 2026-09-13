import { Hackathon } from '../types';

export function getGoogleCalendarUrl(hackathon: Hackathon): string {
  const title = encodeURIComponent(hackathon.title);
  const details = encodeURIComponent(
    `${hackathon.tagline}\n\nOrganizer: ${hackathon.organizer}\nPrize Pool: ${hackathon.prizePool}\nEntry: 100% Free\nOfficial Link: ${hackathon.url}\n\nTracked via Daily Hackathon Tracker`
  );
  const location = encodeURIComponent(hackathon.location);

  // Format dates for Google Calendar: YYYYMMDDTHHMMSSZ
  const formatDate = (dStr: string) => {
    try {
      const date = new Date(dStr);
      return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
    } catch {
      return new Date().toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
    }
  };

  const start = formatDate(hackathon.startDate || hackathon.registrationDeadline);
  const end = formatDate(hackathon.endDate || hackathon.startDate);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function downloadIcsFile(hackathon: Hackathon): void {
  const eventTitle = hackathon.title.replace(/[^a-zA-Z0-9 ]/g, '');
  const cleanDate = (dStr: string) => {
    try {
      const d = new Date(dStr);
      return d.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
    } catch {
      return new Date().toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
    }
  };

  const dtStart = cleanDate(hackathon.startDate || hackathon.registrationDeadline);
  const dtEnd = cleanDate(hackathon.endDate || hackathon.startDate);
  const stamp = cleanDate(new Date().toISOString());

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Daily Hackathon Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:hack-${hackathon.id}@dailyhackathontracker.net`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${hackathon.title}`,
    `DESCRIPTION:${hackathon.tagline}\\n\\nOrganizer: ${hackathon.organizer}\\nPrize Pool: ${hackathon.prizePool}\\nLink: ${hackathon.url}`,
    `URL:${hackathon.url}`,
    `LOCATION:${hackathon.location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${hackathon.title} starts soon!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${eventTitle.slice(0, 30)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
