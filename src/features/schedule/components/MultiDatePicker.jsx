import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatDateKey, isSameDay, isPastDate } from '../helpers';
import HolidayChips from './HolidayChips';
import styles from './MultiDatePicker.module.scss';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function MultiDatePicker({
  selectedDates = [],
  onToggleDate,
  onRemoveHoliday,
}) {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      currentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      currentMonth: true,
      date: new Date(year, month, d),
    });
  }
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      day: i,
      currentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (dayObj) => {
    if (isPastDate(dayObj.date)) return;
    if (onToggleDate) onToggleDate(dayObj.date);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.calendarSection}>
        <div className={styles.calendarHeader}>
          <button type="button" className={styles.navBtn} onClick={goPrev} aria-label="Previous month">
            <FiChevronLeft size={16} />
          </button>
          <span className={styles.monthYear}>
            {MONTHS[month]} {year}
          </span>
          <button type="button" className={styles.navBtn} onClick={goNext} aria-label="Next month">
            <FiChevronRight size={16} />
          </button>
        </div>
        <div className={styles.daysHeader}>
          {DAYS_OF_WEEK.map((d) => (
            <span key={d} className={styles.dayLabel}>{d}</span>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {calendarDays.map((dayObj, idx) => {
            const dateKey = formatDateKey(dayObj.date);
            const isSelected = selectedDates.some((h) =>
              (typeof h === 'string' ? h : h.date) === dateKey
            );
            const isToday = isSameDay(dayObj.date, today);
            const isPast = isPastDate(dayObj.date);

            return (
              <button
                key={idx}
                type="button"
                className={[
                  styles.dayCell,
                  !dayObj.currentMonth ? styles.dayCellOutside : '',
                  isSelected ? styles.dayCellHoliday : '',
                  isToday && !isSelected ? styles.dayCellToday : '',
                  isPast ? styles.dayCellPast : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleDayClick(dayObj)}
                disabled={isPast}
                aria-label={`${dayObj.day} ${isSelected ? 'selected as holiday' : ''}`}
              >
                {dayObj.day}
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.selectedPanel}>
        <span className={styles.selectedLabel}>Selected</span>
        <HolidayChips holidays={selectedDates} onRemove={onRemoveHoliday} />
      </div>
    </div>
  );
}

export default MultiDatePicker;
