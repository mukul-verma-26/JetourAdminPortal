import { useState, useCallback } from 'react';
import {
  DAYS_OF_WEEK,
  DEFAULT_START_TIME,
  DEFAULT_END_TIME,
  DEFAULT_BUFFER_MINUTES,
  DEFAULT_MAX_BOOKINGS_PER_SLOT,
  SLOT_DURATION_OPTIONS,
  MAX_TIME_RANGES_PER_DAY,
} from './constants';
import {
  formatDateKey,
  isPastDate,
  isValidTimeRange,
  hasOverlappingRanges,
} from './helpers';

function createDefaultOperatingDay(day) {
  return {
    day: day.key,
    enabled: day.key !== 'friday',
    timeRanges: [{ id: crypto.randomUUID(), startTime: DEFAULT_START_TIME, endTime: DEFAULT_END_TIME }],
  };
}

function createDefaultSchedule() {
  return {
    operatingDays: DAYS_OF_WEEK.map((d) => createDefaultOperatingDay(d)),
    publicHolidays: [],
    availableBookingTimeRanges: [{ id: crypto.randomUUID(), startTime: '09:00', endTime: '18:00' }],
    applyBookingHoursTo: 'all',
    specificDays: [],
    slotDuration: 30,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    bufferTime: DEFAULT_BUFFER_MINUTES,
    maxBookingsPerSlot: DEFAULT_MAX_BOOKINGS_PER_SLOT,
  };
}

export function useSchedule() {
  const [schedule, setSchedule] = useState(createDefaultSchedule);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const updateOperatingDay = useCallback((dayKey, updates) => {
    setSchedule((prev) => ({
      ...prev,
      operatingDays: prev.operatingDays.map((d) =>
        d.day === dayKey ? { ...d, ...updates } : d
      ),
    }));
  }, []);

  const toggleDay = useCallback((dayKey) => {
    setSchedule((prev) => ({
      ...prev,
      operatingDays: prev.operatingDays.map((d) =>
        d.day === dayKey ? { ...d, enabled: !d.enabled } : d
      ),
    }));
  }, []);

  const setDayEnabled = useCallback((dayKey, enabled) => {
    setSchedule((prev) => ({
      ...prev,
      operatingDays: prev.operatingDays.map((d) =>
        d.day === dayKey ? { ...d, enabled } : d
      ),
    }));
  }, []);

  const setDayTimeRanges = useCallback((dayKey, timeRanges) => {
    setSchedule((prev) => ({
      ...prev,
      operatingDays: prev.operatingDays.map((d) =>
        d.day === dayKey ? { ...d, timeRanges } : d
      ),
    }));
  }, []);

  const toggleHoliday = useCallback((date) => {
    const key = formatDateKey(date);
    setSchedule((prev) => {
      const exists = prev.publicHolidays.some((h) => h.date === key);
      if (exists) {
        return {
          ...prev,
          publicHolidays: prev.publicHolidays.filter((h) => h.date !== key),
        };
      }
      return {
        ...prev,
        publicHolidays: [
          ...prev.publicHolidays,
          { id: crypto.randomUUID(), date: key, name: '' },
        ],
      };
    });
  }, []);

  const addHoliday = useCallback((dateStr) => {
    if (!dateStr) return;
    setSchedule((prev) => {
      const exists = prev.publicHolidays.some((h) => h.date === dateStr);
      if (exists) return prev;
      return {
        ...prev,
        publicHolidays: [
          ...prev.publicHolidays,
          { id: crypto.randomUUID(), date: dateStr, name: '' },
        ],
      };
    });
  }, []);

  const removeHoliday = useCallback((idOrDate) => {
    setSchedule((prev) => ({
      ...prev,
      publicHolidays: prev.publicHolidays.filter(
        (h) => h.id !== idOrDate && h.date !== idOrDate
      ),
    }));
  }, []);

  const addBookingTimeRange = useCallback(() => {
    const count = schedule.availableBookingTimeRanges.length;
    if (count >= MAX_TIME_RANGES_PER_DAY) return;
    setSchedule((prev) => ({
      ...prev,
      availableBookingTimeRanges: [
        ...prev.availableBookingTimeRanges,
        { id: crypto.randomUUID(), startTime: '14:00', endTime: '18:00' },
      ],
    }));
  }, [schedule.availableBookingTimeRanges.length]);

  const removeBookingTimeRange = useCallback((id) => {
    setSchedule((prev) => ({
      ...prev,
      availableBookingTimeRanges:
        prev.availableBookingTimeRanges.length <= 1
          ? prev.availableBookingTimeRanges
          : prev.availableBookingTimeRanges.filter((r) => r.id !== id),
    }));
  }, []);

  const updateBookingTimeRange = useCallback((id, updates) => {
    setSchedule((prev) => ({
      ...prev,
      availableBookingTimeRanges: prev.availableBookingTimeRanges.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }));
  }, []);

  const setScheduleField = useCallback((field, value) => {
    setSchedule((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    const enabledDays = schedule.operatingDays.filter((d) => d.enabled);
    if (enabledDays.length === 0) {
      newErrors.operatingDays = 'Select at least one operating day';
    }
    if (hasOverlappingRanges(schedule.availableBookingTimeRanges)) {
      newErrors.bookingTimeRanges = 'Time ranges cannot overlap';
    }
    for (const range of schedule.availableBookingTimeRanges) {
      if (!isValidTimeRange(range.startTime, range.endTime)) {
        newErrors.bookingTimeRanges = 'End time must be after start time';
        break;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [schedule]);

  const save = useCallback(async () => {
    if (!validate()) return;
    setIsSaving(true);
    setErrors({});
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (window.showToast) {
        window.showToast('Schedule saved successfully', 'success');
      }
    } catch (err) {
      console.log('useSchedule.save', 'Failed to save schedule', err);
      if (window.showToast) {
        window.showToast('Failed to save schedule', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  }, [validate]);

  const today = new Date();
  const todayKey = formatDateKey(today);
  const todayDayIndex = today.getDay();
  const dayKeyMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayDayKey = dayKeyMap[todayDayIndex];
  const todayOperatingDay = schedule.operatingDays.find((d) => d.day === todayDayKey);
  const isHolidayToday = schedule.publicHolidays.some((h) => h.date === todayKey);

  const todayScheduleRanges = (() => {
    if (isHolidayToday || !todayOperatingDay?.enabled) return [];
    const maxPerRange = schedule.maxBookingsPerSlot;
    return schedule.availableBookingTimeRanges.map((range, idx) => ({
      startTime: range.startTime,
      endTime: range.endTime,
      bookedCount: [3, 2, 1, 0][idx] ?? 0,
      maxBookings: maxPerRange,
    }));
  })();

  return {
    schedule,
    isSaving,
    errors,
    updateOperatingDay,
    toggleDay,
    setDayEnabled,
    setDayTimeRanges,
    toggleHoliday,
    addHoliday,
    removeHoliday,
    addBookingTimeRange,
    removeBookingTimeRange,
    updateBookingTimeRange,
    setScheduleField,
    save,
    validate,
    todayScheduleRanges,
    isHolidayToday,
    todayOperatingDay,
    slotDurationOptions: SLOT_DURATION_OPTIONS,
  };
}
