import { useState, useCallback, useMemo } from 'react';
import { INITIAL_CUSTOMERS } from './constants';

function sortByJoiningDate(customers) {
  return [...customers].sort(
    (a, b) =>
      new Date(b.joiningDate || b.joined || 0) -
      new Date(a.joiningDate || a.joined || 0)
  );
}

function getNextCustomerId(customers) {
  const max = customers.reduce((acc, c) => {
    const num = parseInt(c.customerId.replace('C-', ''), 10);
    return isNaN(num) ? acc : Math.max(acc, num);
  }, 0);
  return `C-${String(max + 1).padStart(3, '0')}`;
}

export function useCustomers() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);

  const addCustomer = useCallback((customer) => {
    setCustomers((prev) => {
      const nextId = String(Date.now());
      const nextCustomerId = getNextCustomerId(prev);
      const joiningDate = new Date().toISOString().slice(0, 10);
      const newCustomer = {
        ...customer,
        id: nextId,
        customerId: nextCustomerId,
        joiningDate,
        vehicles: Array.isArray(customer.vehicles) ? customer.vehicles : [],
        totalBookings: customer.totalBookings ?? 0,
        status: customer.status || 'active',
      };
      return sortByJoiningDate([newCustomer, ...prev]);
    });
  }, []);

  const updateCustomer = useCallback((id, updated) => {
    setCustomers((prev) =>
      sortByJoiningDate(
        prev.map((c) => (c.id === id ? { ...c, ...updated, id } : c))
      )
    );
  }, []);

  const deleteCustomer = useCallback((id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const filteredCustomers = useMemo(
    () => ({
      byFilters: (list, filters) => {
        const { name, email, phone } = filters || {};
        return list.filter((c) => {
          if (name && name.trim()) {
            const nameLower = (c.name || '').toLowerCase();
            if (!nameLower.includes(name.trim().toLowerCase())) return false;
          }
          if (email && email.trim()) {
            const emailLower = (c.email || '').toLowerCase();
            if (!emailLower.includes(email.trim().toLowerCase())) return false;
          }
          if (phone && phone.trim()) {
            const phoneNormalized = (c.phone || '').replace(/\D/g, '');
            const searchDigits = phone.trim().replace(/\D/g, '');
            if (!phoneNormalized.includes(searchDigits)) return false;
          }
          return true;
        });
      },
      byStatus: (list, status) => {
        if (!status || status === 'all') return list;
        return list.filter((c) => c.status === status);
      },
    }),
    []
  );

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    filteredCustomers,
  };
}
