import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './DatePicker.module.scss';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function DatePicker({ value, onChange, name, id, error, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef(null);
  const displayRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value + 'T00:00:00');
      if (!isNaN(date.getTime())) {
        setViewDate(date);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inWrapper = wrapperRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inWrapper && !inDropdown) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const DROPDOWN_WIDTH = 300;
  const DROPDOWN_OFFSET = 6;
  const VIEWPORT_PADDING = 8;

  const updateDropdownPosition = () => {
    if (displayRef.current) {
      const rect = displayRef.current.getBoundingClientRect();
      let left = rect.left;
      const rightEdge = left + DROPDOWN_WIDTH;
      if (rightEdge > window.innerWidth - VIEWPORT_PADDING) {
        left = window.innerWidth - DROPDOWN_WIDTH - VIEWPORT_PADDING;
      }
      if (left < VIEWPORT_PADDING) {
        left = VIEWPORT_PADDING;
      }
      let top = rect.bottom + DROPDOWN_OFFSET;
      const dropdownHeight = 320;
      if (top + dropdownHeight > window.innerHeight - VIEWPORT_PADDING) {
        top = Math.max(VIEWPORT_PADDING, rect.top - dropdownHeight - DROPDOWN_OFFSET);
      }
      setDropdownPosition({ top, left });
    }
  };

  useEffect(() => {
    if (isOpen && displayRef.current) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isOpen]);

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

  const goToPrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
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

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className={styles.dropdown}
      style={{
        position: 'fixed',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
          <div className={styles.calendarHeader}>
            <button type="button" className={styles.navBtn} onClick={goToPrevMonth}>
              <FiChevronLeft size={18} />
            </button>
            <span className={styles.monthYear}>
              {MONTHS[month]} {year}
            </span>
            <button type="button" className={styles.navBtn} onClick={goToNextMonth}>
              <FiChevronRight size={18} />
            </button>
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
  );

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div
        ref={displayRef}
        className={`${styles.display} ${error ? styles.displayError : ''} ${isOpen ? styles.displayActive : ''}`}
        onClick={() => {
          if (!isOpen) updateDropdownPosition();
          setIsOpen(!isOpen);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        <FiCalendar size={16} className={styles.calendarIcon} />
        <span className={displayText ? styles.displayText : styles.displayPlaceholder}>
          {displayText || placeholder || 'Select date'}
        </span>
      </div>

      {createPortal(dropdownContent, document.body)}

      <input type="hidden" name={name} id={id} value={value || ''} />
    </div>
  );
}

export default DatePicker;
