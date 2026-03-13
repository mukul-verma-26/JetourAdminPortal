import { useState, useCallback, useEffect } from 'react';
import { getAllBookings } from '../../api/bookings';
import { transformBookings } from './helpers/transformBooking';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchBookings = useCallback(async (filters = {}, page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllBookings(filters, page, limit);
      const transformed = transformBookings(response.bookings);
      setBookings(transformed);
      const responsePage = Number(response.page) || page;
      const responseLimit = Number(response.limit) || limit;
      const responseTotal = Number(response.total) || 0;
      const totalPages = Math.max(1, Math.ceil(responseTotal / responseLimit));
      setPagination({
        page: responsePage,
        limit: responseLimit,
        total: responseTotal,
        totalPages,
      });
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
    pagination,
    searchBookings: fetchBookings,
    addBooking,
    updateBooking,
    deleteBooking,
    refetchBookings: fetchBookings,
  };
}
