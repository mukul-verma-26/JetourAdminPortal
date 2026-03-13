import { useState, useCallback, useEffect } from 'react';
import {
  getCustomers,
  getCustomersForExport,
  getCustomerById,
  createCustomer as createCustomerApi,
  updateCustomer as updateCustomerApi,
  deleteCustomer as deleteCustomerApi,
} from '../../api/customers';
import { mapCustomerFromApi } from './helpers';
import { reverseGeocodeLatLng } from './locationService';
import { downloadCustomersToExcel } from './exportCustomersToExcel';

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
  const [isExporting, setIsExporting] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    name: '',
    contact_number: '',
    email: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const fetchCustomers = useCallback(async ({
    filters = {},
    page = 1,
    limit = 10,
  } = {}) => {
    setIsLoading(true);
    try {
      const normalizedFilters = {
        name: String(filters?.name || '').trim(),
        contact_number: String(filters?.contact_number || '').trim(),
        email: String(filters?.email || '').trim(),
      };
      const res = await getCustomers({
        ...normalizedFilters,
        page,
        limit,
      });
      const list = res?.data || res || [];
      const mapped = Array.isArray(list)
        ? list.map(mapCustomerFromApi).filter(Boolean)
        : [];
      setCustomers(sortByJoiningDate(mapped));
      setActiveFilters(normalizedFilters);
      setPagination((prev) => ({
        ...prev,
        page: Number(res?.page) || page,
        totalPages: Number(res?.total_pages || res?.pages) || 1,
        total: Number(res?.total) || mapped.length,
        limit: Number(res?.limit) || limit,
      }));
    } catch (error) {
      console.log('fetchCustomers', 'Failed to fetch customers', error);
      if (typeof window?.showToast === 'function') {
        window.showToast('Failed to load customers', 'error');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchInitialCustomers() {
      try {
        await fetchCustomers({ page: 1, limit: 10 });
      } catch {
        // Error is already handled and logged inside fetchCustomers
      }
    }
    fetchInitialCustomers();
  }, [fetchCustomers]);

  const addCustomer = useCallback(async (payload) => {
    setIsCreating(true);
    try {
      const data = await createCustomerApi(payload);
      const created = data?.data || data?.customer || data;
      if (created) {
        await fetchCustomers({
          filters: activeFilters,
          page: pagination.page,
          limit: pagination.limit,
        });
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
  }, [activeFilters, fetchCustomers, pagination.limit, pagination.page]);

  const updateCustomer = useCallback(async (id, payload) => {
    setIsUpdating(true);
    try {
      const customer = customers.find((c) => c.id === id);
      const apiId = customer?._id || id;
      await updateCustomerApi(apiId, payload);
      await fetchCustomers({
        filters: activeFilters,
        page: pagination.page,
        limit: pagination.limit,
      });
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
  }, [activeFilters, customers, fetchCustomers, pagination.limit, pagination.page]);

  const deleteCustomer = useCallback(async (id) => {
    setIsDeleting(true);
    try {
      const customer = customers.find((c) => c.id === id);
      const apiId = customer?._id || id;
      await deleteCustomerApi(apiId);
      const shouldMoveToPreviousPage = customers.length === 1 && pagination.page > 1;
      const nextPage = shouldMoveToPreviousPage ? pagination.page - 1 : pagination.page;
      await fetchCustomers({
        filters: activeFilters,
        page: nextPage,
        limit: pagination.limit,
      });
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
  }, [activeFilters, customers, fetchCustomers, pagination.limit, pagination.page]);

  const fetchCustomerDetails = useCallback(async (customerId) => {
    try {
      const res = await getCustomerById(customerId);
      const customer = mapCustomerFromApi(res?.data || res?.customer || res);
      if (
        customer &&
        !customer.google_location &&
        customer.locationData?.lat != null &&
        customer.locationData?.lng != null
      ) {
        try {
          const formattedAddress = await reverseGeocodeLatLng(
            customer.locationData.lat,
            customer.locationData.lng
          );
          if (formattedAddress) {
            customer.google_location = formattedAddress;
            customer.locationData = {
              ...customer.locationData,
              formatted_address: formattedAddress,
            };
          }
        } catch (geocodeError) {
          console.log(
            'fetchCustomerDetails',
            `Failed reverse geocoding for customer ${customerId}`,
            geocodeError
          );
        }
      }
      return customer;
    } catch (error) {
      console.log('fetchCustomerDetails', `Failed to fetch customer ${customerId}`, error);
      if (typeof window?.showToast === 'function') {
        window.showToast('Failed to fetch customer details', 'error');
      }
      throw error;
    }
  }, []);

  const exportCustomers = useCallback(async (filters = {}) => {
    setIsExporting(true);
    try {
      const response = await getCustomersForExport(filters);
      const list = response?.data || response || [];
      const mapped = Array.isArray(list) ? list.map(mapCustomerFromApi).filter(Boolean) : [];
      downloadCustomersToExcel(mapped);
      if (typeof window?.showToast === 'function') {
        window.showToast('Customers report downloaded', 'success');
      }
    } catch (error) {
      console.log('exportCustomers', 'Failed to export customers', error);
      if (typeof window?.showToast === 'function') {
        window.showToast('Failed to export customers report', 'error');
      }
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    fetchCustomerDetails,
    searchCustomers: (filters) =>
      fetchCustomers({
        filters,
        page: 1,
        limit: pagination.limit,
      }),
    pagination,
    goToPage: (page) =>
      fetchCustomers({
        filters: activeFilters,
        page,
        limit: pagination.limit,
      }),
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isExporting,
    exportCustomers,
  };
}
