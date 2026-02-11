import { useState, useCallback, useMemo } from 'react';
import { INITIAL_BOOKINGS } from './constants';

function sortByBookingTime(bookings) {
  return [...bookings].sort((a, b) => {
    const timeA = a.booking_time || '00:00';
    const timeB = b.booking_time || '00:00';
    return timeB.localeCompare(timeA);
  });
}

export function useBookings() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  const filteredBookings = useMemo(
    () => ({
      byFilters: (list, filters) => {
        const { name, phone, vin } = filters || {};
        return list.filter((b) => {
          if (name && name.trim()) {
            const nameLower = (b.name || '').toLowerCase();
            if (!nameLower.includes(name.trim().toLowerCase())) return false;
          }
          if (phone && phone.trim()) {
            const phoneNormalized = (b.phone || '').replace(/\D/g, '');
            const searchDigits = phone.trim().replace(/\D/g, '');
            if (!phoneNormalized.includes(searchDigits)) return false;
          }
          if (vin && vin.trim()) {
            const vinLower = (b.vehicle_registration || b.vin || '').toLowerCase();
            if (!vinLower.includes(vin.trim().toLowerCase())) return false;
          }
          return true;
        });
      },
    }),
    []
  );

  const addBooking = useCallback((booking) => {
    const newBooking = {
      ...booking,
      id: String(Date.now()),
    };
    setBookings((prev) => sortByBookingTime([newBooking, ...prev]));
  }, []);

  const updateBooking = useCallback((id, updatedBooking) => {
    setBookings((prev) =>
      sortByBookingTime(
        prev.map((b) => (b.id === id ? { ...b, ...updatedBooking, id } : b))
      )
    );
  }, []);

  const deleteBooking = useCallback((id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    filteredBookings,
  };
}
