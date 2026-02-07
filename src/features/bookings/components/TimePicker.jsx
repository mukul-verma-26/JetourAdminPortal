import { useState, useEffect, useRef } from 'react';
import { FiClock } from 'react-icons/fi';
import styles from './TimePicker.module.scss';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function TimePicker({ value, onChange, name, id, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [period, setPeriod] = useState('AM');
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const hour24 = parseInt(h, 10);
      const min = parseInt(m, 10);

      if (hour24 >= 12) {
        setPeriod('PM');
        setHour(hour24 === 12 ? 12 : hour24 - 12);
      } else {
        setPeriod('AM');
        setHour(hour24 === 0 ? 12 : hour24);
      }
      setMinute(min);
    } else {
      setHour(null);
      setMinute(null);
      setPeriod('AM');
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

  const emitChange = (h, m, p) => {
    if (h !== null && m !== null) {
      let hour24 = h;
      if (p === 'PM' && h !== 12) hour24 = h + 12;
      if (p === 'AM' && h === 12) hour24 = 0;

      const time24 = `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      onChange({ target: { name, value: time24 } });
    } else {
      onChange({ target: { name, value: '' } });
    }
  };

  const selectHour = (h) => {
    setHour(h);
    emitChange(h, minute, period);
  };

  const selectMinute = (m) => {
    setMinute(m);
    emitChange(hour, m, period);
  };

  const togglePeriod = (p) => {
    setPeriod(p);
    emitChange(hour, minute, p);
  };

  const displayValue = () => {
    if (hour === null || minute === null) return '';
    return `${hour}:${String(minute).padStart(2, '0')} ${period}`;
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div
        className={`${styles.display} ${error ? styles.displayError : ''} ${isOpen ? styles.displayActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        <FiClock size={16} className={styles.clockIcon} />
        <span className={displayValue() ? styles.displayText : styles.displayPlaceholder}>
          {displayValue() || 'Select time'}
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* AM / PM toggle */}
          <div className={styles.periodToggle}>
            <button
              type="button"
              className={`${styles.periodBtn} ${period === 'AM' ? styles.periodBtnActive : ''}`}
              onClick={() => togglePeriod('AM')}
            >
              AM
            </button>
            <button
              type="button"
              className={`${styles.periodBtn} ${period === 'PM' ? styles.periodBtnActive : ''}`}
              onClick={() => togglePeriod('PM')}
            >
              PM
            </button>
          </div>

          <div className={styles.columns}>
            {/* Hours */}
            <div className={styles.column}>
              <span className={styles.columnLabel}>Hour</span>
              <div className={styles.grid}>
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={`${styles.cell} ${hour === h ? styles.cellActive : ''}`}
                    onClick={() => selectHour(h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className={styles.column}>
              <span className={styles.columnLabel}>Min</span>
              <div className={styles.grid}>
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`${styles.cell} ${minute === m ? styles.cellActive : ''}`}
                    onClick={() => selectMinute(m)}
                  >
                    {String(m).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          {hour !== null && minute !== null && (
            <div className={styles.preview}>
              <span className={styles.previewTime}>
                {hour}:{String(minute).padStart(2, '0')} {period}
              </span>
            </div>
          )}
        </div>
      )}

      <input type="hidden" name={name} id={id} value={value || ''} />
    </div>
  );
}

export default TimePicker;
