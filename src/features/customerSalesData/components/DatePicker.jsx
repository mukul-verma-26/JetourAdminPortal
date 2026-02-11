import { useState, useEffect, useRef } from 'react';
import { FiCalendar } from 'react-icons/fi';
import styles from './DatePicker.module.scss';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1920;
const MAX_YEAR = CURRENT_YEAR;
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MAX_YEAR - i);

function DatePicker({ value, onChange, name, id, error, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value + 'T00:00:00');
      if (!isNaN(date.getTime())) {
        setViewDate(date);
      }
    } else {
      setViewDate(new Date());
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedDate = value ? new Date(value + 'T00:00:00') : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  const handleDayClick = (dayObj) => {
    const d = dayObj.date;
    const dateStr = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-');
    onChange({ target: { name, value: dateStr } });
    setIsOpen(false);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setViewDate(new Date(year, newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setViewDate(new Date(newYear, month, 1));
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const formatDisplayDate = () => {
    if (!value) return '';
    const date = new Date(value + 'T00:00:00');
    if (isNaN(date.getTime())) return value;
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const displayText = formatDisplayDate();

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div
        className={`${styles.display} ${error ? styles.displayError : ''} ${isOpen ? styles.displayActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        <FiCalendar size={16} className={styles.calendarIcon} />
        <span className={displayText ? styles.displayText : styles.displayPlaceholder}>
          {displayText || placeholder || 'Select date'}
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.monthYearRow}>
            <select
              className={styles.monthSelect}
              value={month}
              onChange={handleMonthChange}
              onClick={(e) => e.stopPropagation()}
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className={styles.yearSelect}
              value={year}
              onChange={handleYearChange}
              onClick={(e) => e.stopPropagation()}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.daysHeader}>
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className={styles.dayLabel}>{d}</span>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {calendarDays.map((dayObj, idx) => {
              const isSelected = selectedDate && isSameDay(dayObj.date, selectedDate);
              const isTodayCell = isSameDay(dayObj.date, today);

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    styles.dayCell,
                    !dayObj.currentMonth ? styles.dayCellOutside : '',
                    isSelected ? styles.dayCellSelected : '',
                    isTodayCell && !isSelected ? styles.dayCellToday : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleDayClick(dayObj)}
                >
                  {dayObj.day}
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className={styles.selectedPreview}>{displayText}</div>
          )}
        </div>
      )}

      <input type="hidden" name={name} id={id} value={value || ''} />
    </div>
  );
}

export default DatePicker;
