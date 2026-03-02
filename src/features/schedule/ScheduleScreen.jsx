import { useSchedule } from './useSchedule';
import { MAX_TIME_RANGES_PER_DAY } from './constants';
import OperatingDaysSection from './components/OperatingDaysSection';
import PublicHolidaysSection from './components/PublicHolidaysSection';
import TimeRangeSelector from './components/TimeRangeSelector';
import SchedulePreview from './components/SchedulePreview';
import styles from './ScheduleScreen.module.scss';

function ScheduleScreen() {
  const {
    schedule,
    isLoading,
    isSaving,
    errors,
    toggleDay,
    toggleHoliday,
    removeHoliday,
    addBookingTimeRange,
    removeBookingTimeRange,
    updateBookingTimeRange,
    save,
    todayScheduleRanges,
    isHolidayToday,
    todayOperatingDay,
  } = useSchedule();

  const isClosedToday = isHolidayToday || !todayOperatingDay?.enabled;

  if (isLoading) {
    return (
      <div className={styles.screen}>
        <p className={styles.loadingText}>Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Schedule Management</h2>
          <p className={styles.subtitle}>Configure operating hours and time slots</p>
        </div>
        <button type="button" className={styles.saveBtn} onClick={save} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <OperatingDaysSection
        operatingDays={schedule.operatingDays}
        error={errors.operatingDays}
        onToggle={toggleDay}
      />

      <PublicHolidaysSection
        publicHolidays={schedule.publicHolidays}
        onToggleDate={toggleHoliday}
        onRemoveHoliday={removeHoliday}
      />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Available Booking Hours</h3>
        <p className={styles.sectionDesc}>Define time slots when customers can book (supports split schedules)</p>
        {errors.bookingTimeRanges && <p className={styles.error}>{errors.bookingTimeRanges}</p>}
        <div className={styles.card}>
          <TimeRangeSelector
            timeRanges={schedule.availableBookingTimeRanges}
            onAdd={addBookingTimeRange}
            onRemove={removeBookingTimeRange}
            onUpdate={updateBookingTimeRange}
            canAdd={schedule.availableBookingTimeRanges.length < MAX_TIME_RANGES_PER_DAY}
            canRemove={schedule.availableBookingTimeRanges.length > 1}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Today&apos;s Schedule Overview</h3>
        <div className={styles.previewCard}>
          <SchedulePreview
            scheduleRanges={todayScheduleRanges}
            isClosed={isClosedToday}
          />
        </div>
      </section>
    </div>
  );
}

export default ScheduleScreen;
