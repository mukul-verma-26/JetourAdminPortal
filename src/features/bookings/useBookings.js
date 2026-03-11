import { useState, useCallback, useMemo, useEffect } from 'react';
import { getAllBookings } from '../../api/bookings';
import { transformBookings } from './helpers/transformBooking';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllBookings();
      const transformed = transformBookings(response.bookings);
      setBookings(transformed);
    } catch (err) {
      console.log('useBookings', 'fetchBookings failed', err);
      setError(err?.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = useMemo(
    () => ({
      byFilters: (list, filters) => {
        const { name, phone, vin, dateFrom, dateTo } = filters || {};
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
          if (dateFrom && dateFrom.trim()) {
            const bookingDate = b.booking_date || '';
            if (!bookingDate || bookingDate < dateFrom.trim()) return false;
          }
          if (dateTo && dateTo.trim()) {
            const bookingDate = b.booking_date || '';
            if (!bookingDate || bookingDate > dateTo.trim()) return false;
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
    setBookings((prev) => [newBooking, ...prev]);
  }, []);

  const updateBooking = useCallback((id, updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedBooking, id } : b))
    );
  }, []);

  const deleteBooking = useCallback((id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return {
    bookings,
    isLoading,
    error,
    addBooking,
    updateBooking,
    deleteBooking,
    filteredBookings,
    refetchBookings: fetchBookings,
  };
}
