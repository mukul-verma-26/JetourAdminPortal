import { useState, useCallback, useEffect } from 'react';
import { getActiveSchedule, createSchedule, updateSchedule } from '../../api/schedule';
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
  isValidTimeRange,
  hasOverlappingRanges,
} from './helpers';

function mapApiToSchedule(apiData) {
  const operatingDays = DAYS_OF_WEEK.map((d) => {
    const match = apiData.operating_days?.find((od) => od.day === d.key);
    return {
      day: d.key,
      enabled: match?.enabled ?? false,
      timeRanges: [{ id: crypto.randomUUID(), startTime: DEFAULT_START_TIME, endTime: DEFAULT_END_TIME }],
    };
  });

  const publicHolidays = (apiData.public_holidays || []).map((h) => ({
    id: crypto.randomUUID(),
    date: h.date,
    name: h.reason || '',
  }));

  const availableBookingTimeRanges = (apiData.available_booking_time_ranges || []).map((r) => ({
    id: crypto.randomUUID(),
    startTime: r.start_time,
    endTime: r.end_time,
  }));

  if (availableBookingTimeRanges.length === 0) {
    availableBookingTimeRanges.push({ id: crypto.randomUUID(), startTime: '09:00', endTime: '18:00' });
  }

  return {
    _id: apiData._id || null,
    operatingDays,
    publicHolidays,
    availableBookingTimeRanges,
    applyBookingHoursTo: 'all',
    specificDays: [],
    slotDuration: apiData.slot_interval_minutes || 30,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    bufferTime: apiData.buffer_between_bookings_minutes || DEFAULT_BUFFER_MINUTES,
    maxBookingsPerSlot: DEFAULT_MAX_BOOKINGS_PER_SLOT,
    maxAdvanceBookingDays: apiData.max_advance_booking_days || 30,
  };
}

function mapScheduleToApi(schedule) {
  return {
    operating_days: schedule.operatingDays.map((d) => ({
      day: d.day,
      enabled: d.enabled,
    })),
    public_holidays: schedule.publicHolidays.map((h) => ({
      date: h.date,
      ...(h.name ? { reason: h.name } : {}),
    })),
    available_booking_time_ranges: schedule.availableBookingTimeRanges.map((r) => ({
      start_time: r.startTime,
      end_time: r.endTime,
    })),
    is_active: true,
  };
}

function createDefaultSchedule() {
  return {
    _id: null,
    operatingDays: DAYS_OF_WEEK.map((d) => ({
      day: d.key,
      enabled: d.key !== 'friday',
      timeRanges: [{ id: crypto.randomUUID(), startTime: DEFAULT_START_TIME, endTime: DEFAULT_END_TIME }],
    })),
    publicHolidays: [],
    availableBookingTimeRanges: [{ id: crypto.randomUUID(), startTime: '09:00', endTime: '18:00' }],
    applyBookingHoursTo: 'all',
    specificDays: [],
    slotDuration: 30,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    bufferTime: DEFAULT_BUFFER_MINUTES,
    maxBookingsPerSlot: DEFAULT_MAX_BOOKINGS_PER_SLOT,
    maxAdvanceBookingDays: 30,
  };
}

export function useSchedule() {
  const [schedule, setSchedule] = useState(createDefaultSchedule);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function fetchSchedule() {
      setIsLoading(true);
      try {
        const data = await getActiveSchedule();
        if (!cancelled && data) {
          setSchedule(mapApiToSchedule(data));
        }
      } catch (error) {
        if (!cancelled) {
          const status = error?.response?.status;
          if (status === 404) {
            console.log('useSchedule', 'No active schedule found, using defaults for creation');
          } else {
            console.log('useSchedule', 'Failed to fetch active schedule', error);
            if (window.showToast) {
              window.showToast('Failed to load schedule', 'error');
            }
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchSchedule();
    return () => { cancelled = true; };
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

  const updateBookingTimeRange = useCallback((id, fieldOrUpdates, value) => {
    const updates =
      typeof fieldOrUpdates === 'string' && value !== undefined
        ? { [fieldOrUpdates]: value }
        : fieldOrUpdates;
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
    for (const range of schedule.availableBookingTimeRanges) {
      if (!isValidTimeRange(range.startTime, range.endTime)) {
        newErrors.bookingTimeRanges = 'End time must be after start time';
        break;
      }
    }
    if (!newErrors.bookingTimeRanges && hasOverlappingRanges(schedule.availableBookingTimeRanges)) {
      newErrors.bookingTimeRanges = 'Time ranges cannot overlap';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [schedule]);

  const save = useCallback(async () => {
    if (!validate()) return;
    setIsSaving(true);
    setErrors({});
    try {
      const payload = mapScheduleToApi(schedule);
      let result;
      if (schedule._id) {
        result = await updateSchedule(schedule._id, payload);
      } else {
        result = await createSchedule(payload);
      }
      if (result) {
        setSchedule(mapApiToSchedule(result));
      }
      if (window.showToast) {
        window.showToast(
          schedule._id ? 'Schedule updated successfully' : 'Schedule created successfully',
          'success',
        );
      }
    } catch (err) {
      console.log('useSchedule.save', 'Failed to save schedule', err);
      if (window.showToast) {
        window.showToast(err?.response?.data?.message || 'Failed to save schedule', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  }, [validate, schedule]);

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
    isLoading,
    isSaving,
    errors,
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
