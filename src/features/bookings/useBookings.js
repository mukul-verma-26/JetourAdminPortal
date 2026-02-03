import { useState, useCallback } from 'react';
import { INITIAL_BOOKINGS } from './constants';

function sortByBookingDate(bookings) {
  return [...bookings].sort((a, b) => {
    const dateA = new Date(a.booking_date.split('/').reverse().join('-') + 'T' + a.booking_time);
    const dateB = new Date(b.booking_date.split('/').reverse().join('-') + 'T' + b.booking_time);
    return dateB - dateA;
  });
}

export function useBookings() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  const addBooking = useCallback((booking) => {
    const newBooking = {
      ...booking,
      id: String(Date.now()),
    };
    setBookings((prev) => sortByBookingDate([newBooking, ...prev]));
  }, []);

  const updateBooking = useCallback((id, updatedBooking) => {
    setBookings((prev) =>
      sortByBookingDate(
        prev.map((b) => (b.id === id ? { ...b, ...updatedBooking, id } : b))
      )
    );
  }, []);

  const deleteBooking = useCallback((id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { bookings, addBooking, updateBooking, deleteBooking };
}
