import { useState, useCallback } from 'react';
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

  return { bookings, addBooking, updateBooking, deleteBooking };
}
