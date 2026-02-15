/**
 * Format 24h time string (HH:mm) to 12h display (e.g. "9 AM", "2:30 PM")
 */
export function formatTime12h(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const minStr = m > 0 ? `:${String(m).padStart(2, '0')}` : '';
  return `${hour12}${minStr} ${period}`;
}

/**
 * Convert 12h display to 24h string
 */
export function parseTime12hTo24(display) {
  if (!display) return null;
  const match = display.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

/**
 * Format date string (YYYY-MM-DD) for display (e.g. "15 Jan 2026")
 */
export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(a, b) {
  const d1 = a instanceof Date ? a : new Date(a);
  const d2 = b instanceof Date ? b : new Date(b);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Check if date is in the past
 */
export function isPastDate(date) {
  const d = date instanceof Date ? new Date(date.getTime()) : new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

/**
 * Parse time string to minutes since midnight
 */
export function timeToMinutes(time24) {
  if (!time24) return 0;
  const [h, m] = time24.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Check if two time ranges overlap
 */
export function timeRangesOverlap(r1, r2) {
  const s1 = timeToMinutes(r1.startTime);
  const e1 = timeToMinutes(r1.endTime);
  const s2 = timeToMinutes(r2.startTime);
  const e2 = timeToMinutes(r2.endTime);
  return s1 < e2 && s2 < e1;
}

/**
 * Validate time range: end must be after start
 */
export function isValidTimeRange(startTime, endTime) {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
}

/**
 * Check if any time ranges overlap in array
 */
export function hasOverlappingRanges(ranges) {
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      if (timeRangesOverlap(ranges[i], ranges[j])) return true;
    }
  }
  return false;
}

/**
 * Generate time slots between start and end with given duration
 */
export function generateTimeSlots(startTime, endTime, slotDurationMinutes) {
  const slots = [];
  let current = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  while (current + slotDurationMinutes <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    current += slotDurationMinutes;
  }
  return slots;
}

/**
 * Get display string for time range
 */
export function formatTimeRangeDisplay(range) {
  return `${formatTime12h(range.startTime)} - ${formatTime12h(range.endTime)}`;
}
