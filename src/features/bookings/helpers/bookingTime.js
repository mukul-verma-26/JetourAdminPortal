/**
 * Normalizes time strings (e.g. "9:00", "09:00", "09:00:00") to "HH:mm".
 */
export function normalizeBookingTime(timeStr) {
  if (timeStr == null || timeStr === '') return '';
  const match = String(timeStr)
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\.\d+)?/);
  if (!match) return String(timeStr).trim();
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (Number.isNaN(h) || Number.isNaN(m)) return String(timeStr).trim();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function bookingTimesEqual(a, b) {
  if (!a || !b) return false;
  return normalizeBookingTime(a) === normalizeBookingTime(b);
}
