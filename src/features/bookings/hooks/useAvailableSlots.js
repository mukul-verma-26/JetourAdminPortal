import { useEffect, useState } from 'react';
import { getAvailableSlots } from '../../../api/slots';

export function useAvailableSlots({ bookingDate, packageId, isModalOpen }) {
  const [slots, setSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchAvailableSlots() {
      if (!isModalOpen || !bookingDate || !packageId) {
        setSlots([]);
        setSlotsError('');
        setIsLoadingSlots(false);
        return;
      }

      setIsLoadingSlots(true);
      setSlotsError('');

      try {
        const response = await getAvailableSlots({
          date: bookingDate,
          packageId,
        });

        if (cancelled) return;

        if (response?.success) {
          setSlots(response.data || []);
        } else {
          setSlots([]);
          setSlotsError('Failed to load available slots');
        }
      } catch (error) {
        if (cancelled) return;
        console.log(
          'useAvailableSlots',
          `GET /slots/available?date=${bookingDate}&package_id=${packageId}`,
          error
        );
        setSlots([]);
        setSlotsError(error?.response?.data?.message || 'Failed to load available slots');
      } finally {
        if (!cancelled) {
          setIsLoadingSlots(false);
        }
      }
    }

    fetchAvailableSlots();

    return () => {
      cancelled = true;
    };
  }, [bookingDate, packageId, isModalOpen]);

  return {
    slots,
    isLoadingSlots,
    slotsError,
  };
}
