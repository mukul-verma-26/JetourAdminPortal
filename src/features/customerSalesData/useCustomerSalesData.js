import { useState, useCallback, useMemo } from 'react';
import { INITIAL_SALES_DATA } from './constants';

function getNextSalesDataId(list) {
  const max = list.reduce((acc, item) => {
    const num = parseInt((item.salesDataId || '').replace('SD-', ''), 10);
    return isNaN(num) ? acc : Math.max(acc, num);
  }, 0);
  return `SD-${String(max + 1).padStart(3, '0')}`;
}

export function useCustomerSalesData() {
  const [salesDataList, setSalesDataList] = useState(INITIAL_SALES_DATA);

  const addSalesData = useCallback((data, vehicleOptions) => {
    setSalesDataList((prev) => {
      const nextId = String(Date.now());
      const nextSalesDataId = getNextSalesDataId(prev);
      const vehicle = vehicleOptions.find((v) => v.id === data.vehicleId);
      const newItem = {
        ...data,
        id: nextId,
        salesDataId: nextSalesDataId,
        vehicleName: vehicle?.name || '—',
      };
      return [newItem, ...prev];
    });
  }, []);

  const updateSalesData = useCallback((id, updated, vehicleOptions) => {
    setSalesDataList((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const vehicle = vehicleOptions.find((v) => v.id === updated.vehicleId);
        return {
          ...item,
          ...updated,
          id,
          vehicleName: vehicle?.name || item.vehicleName,
        };
      })
    );
  }, []);

  const deleteSalesData = useCallback((id) => {
    setSalesDataList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const filteredSalesData = useMemo(
    () => ({
      byFilters: (list, filters) => {
        const { contact, registration, vin } = filters || {};
        return list.filter((item) => {
          if (contact && contact.trim()) {
            const phoneNormalized = (item.customerContactNumber || '').replace(/\D/g, '');
            const searchDigits = contact.trim().replace(/\D/g, '');
            if (!phoneNormalized.includes(searchDigits)) return false;
          }
          if (registration && registration.trim()) {
            const regLower = (item.registrationNumber || '').toLowerCase();
            if (!regLower.includes(registration.trim().toLowerCase())) return false;
          }
          if (vin && vin.trim()) {
            const vinLower = (item.vin || '').toLowerCase();
            if (!vinLower.includes(vin.trim().toLowerCase())) return false;
          }
          return true;
        });
      },
      byStatus: (list, status) => {
        if (!status || status === 'all') return list;
        return list.filter((item) => item.customerStatus === status);
      },
    }),
    []
  );

  return {
    salesDataList,
    addSalesData,
    updateSalesData,
    deleteSalesData,
    filteredSalesData,
  };
}
