import { useState, useCallback, useEffect } from 'react';
import { getAllBookings, getBookingsForExport } from '../../api/bookings';
import { transformBookings } from './helpers/transformBooking';
import { downloadBookingsToExcel } from './helpers/exportBookingsToExcel';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
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

  const exportBookings = useCallback(async (filters = {}) => {
    setIsExporting(true);
    try {
      const response = await getBookingsForExport(filters);
      const transformed = transformBookings(response?.bookings || []);
      downloadBookingsToExcel(transformed);
      if (window.showToast) {
        window.showToast('Bookings report downloaded', 'success');
      }
    } catch (err) {
      console.log('useBookings', 'exportBookings failed', err);
      if (window.showToast) {
        window.showToast('Failed to export bookings report', 'error');
      }
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    bookings,
    isLoading,
    error,
    pagination,
    isExporting,
    searchBookings: fetchBookings,
    exportBookings,
    addBooking,
    updateBooking,
    deleteBooking,
    refetchBookings: fetchBookings,
  };
}
