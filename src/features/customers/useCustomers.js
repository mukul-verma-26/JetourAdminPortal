import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  getCustomers,
  createCustomer as createCustomerApi,
  updateCustomer as updateCustomerApi,
  deleteCustomer as deleteCustomerApi,
} from '../../api/customers';
import { mapCustomerFromApi } from './helpers';

function sortByJoiningDate(customers) {
  return [...customers].sort(
    (a, b) =>
      new Date(b.joiningDate || b.joined || 0) -
      new Date(a.joiningDate || a.joined || 0)
  );
}

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchCustomers() {
      setIsLoading(true);
      try {
        const res = await getCustomers();
        const list = res?.data || res || [];
        if (!cancelled) {
          const mapped = Array.isArray(list)
            ? list.map(mapCustomerFromApi).filter(Boolean)
            : [];
          setCustomers(sortByJoiningDate(mapped));
        }
      } catch (error) {
        if (!cancelled) {
          console.log('useCustomers', 'Failed to fetch customers', error);
          if (typeof window?.showToast === 'function') {
            window.showToast('Failed to load customers', 'error');
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchCustomers();
    return () => {
      cancelled = true;
    };
  }, []);

  const addCustomer = useCallback(async (payload) => {
    setIsCreating(true);
    try {
      const data = await createCustomerApi(payload);
      const created = data?.data || data?.customer || data;
      if (created) {
        const newCustomer = mapCustomerFromApi({
          ...created,
          customer_id: created.customer_id || created._id || created.id,
        });
        if (newCustomer) {
          setCustomers((prev) => sortByJoiningDate([newCustomer, ...prev]));
        }
      }
      if (typeof window?.showToast === 'function') {
        window.showToast('Customer added successfully', 'success');
      }
    } catch (error) {
      console.log('addCustomer', 'Failed', error);
      console.log('addCustomer', 'Error response:', error?.response?.data);
      if (typeof window?.showToast === 'function') {
        window.showToast(
          error?.response?.data?.message || 'Failed to add customer',
          'error'
        );
      }
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateCustomer = useCallback(async (id, payload) => {
    setIsUpdating(true);
    try {
      const customer = customers.find((c) => c.id === id);
      const apiId = customer?._id || id;
      await updateCustomerApi(apiId, payload);
      const res = await getCustomers();
      const list = res?.data || res || [];
      const mapped = Array.isArray(list)
        ? list.map(mapCustomerFromApi).filter(Boolean)
        : [];
      setCustomers(sortByJoiningDate(mapped));
      if (typeof window?.showToast === 'function') {
        window.showToast('Customer updated successfully', 'success');
      }
    } catch (error) {
      console.log('updateCustomer', 'Failed', error);
      console.log('updateCustomer', 'Error response:', error?.response?.data);
      if (typeof window?.showToast === 'function') {
        window.showToast(
          error?.response?.data?.message || 'Failed to update customer',
          'error'
        );
      }
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [customers]);

  const deleteCustomer = useCallback(async (id) => {
    setIsDeleting(true);
    try {
      const customer = customers.find((c) => c.id === id);
      const apiId = customer?._id || id;
      await deleteCustomerApi(apiId);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (typeof window?.showToast === 'function') {
        window.showToast('Customer deleted successfully', 'success');
      }
    } catch (error) {
      console.log('deleteCustomer', 'Failed', error);
      console.log('deleteCustomer', 'Error response:', error?.response?.data);
      if (typeof window?.showToast === 'function') {
        window.showToast(
          error?.response?.data?.message || 'Failed to delete customer',
          'error'
        );
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [customers]);

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
            const phoneNormalized = (c.phone || c.contact_number || '').replace(/\D/g, '');
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
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
