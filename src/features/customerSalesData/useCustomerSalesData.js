import { useState, useCallback, useMemo, useEffect } from 'react';
import { getCustomerSalesData, createCustomerSalesData } from '../../api/customerSalesData';
import { getVehicles } from '../../api/vehicles';

function getNextSalesDataId(list) {
  const max = list.reduce((acc, item) => {
    const num = parseInt((item.salesDataId || '').replace('SD-', ''), 10);
    return isNaN(num) ? acc : Math.max(acc, num);
  }, 0);
  return `SD-${String(max + 1).padStart(3, '0')}`;
}

function mapVehicleOption(item) {
  return {
    id: item?.id || item?.vehicle_id || item?._id || '',
    _id: item?._id || '',
    modelId: item?.model_id || item?.id || item?.vehicle_id || item?._id || '',
    name: item?.name || item?.vehicle_model || '—',
  };
}

function getVehicleName(vehicleFromSale, matchedVehicle) {
  return (
    vehicleFromSale?.name ||
    matchedVehicle?.name ||
    vehicleFromSale?.vehicle_model ||
    vehicleFromSale?.model_id ||
    '—'
  );
}

function getVehicleOptionId(vehicleFromSale, matchedVehicle) {
  return (
    matchedVehicle?.id ||
    vehicleFromSale?.vehicle_id ||
    vehicleFromSale?._id ||
    vehicleFromSale?.id ||
    vehicleFromSale?.model_id ||
    ''
  );
}

function resolveSalesVehicle(vehicleFromSale, vehicleOptions) {
  const modelId = vehicleFromSale?.model_id || '';
  const matchedVehicle = vehicleOptions.find(
    (vehicle) =>
      Boolean(modelId) &&
      [vehicle.modelId, vehicle.id, vehicle._id].filter(Boolean).includes(modelId)
  );
  return {
    vehicleId: getVehicleOptionId(vehicleFromSale, matchedVehicle),
    vehicleName: getVehicleName(vehicleFromSale, matchedVehicle),
  };
}

function mapSalesDataItem(item, vehicleOptions) {
  return {
    ...resolveSalesVehicle(item?.vehicle, vehicleOptions),
    id: item?._id || item?.id || String(Date.now()),
    _id: item?._id || item?.id || '',
    salesDataId: item?.vehicle?.model_id || item?._id || '—',
    customerName: item?.customer?.name || '',
    customerContactNumber: `${item?.customer?.country_code || ''}${item?.customer?.contact_number || ''}`,
    registrationNumber: item?.vehicle?.registration_number || '',
    vin: item?.vehicle?.vin || '',
    soldDate: item?.vehicle?.sold_date || '',
    modelYear: item?.vehicle?.model_year ? String(item.vehicle.model_year) : '',
    variantName: item?.vehicle?.variant || '',
    color: item?.vehicle?.color || '',
    lastServiceDate: item?.vehicle?.last_service_date || null,
    lastRecordedMileage: item?.vehicle?.last_recorded_mileage
      ? String(item.vehicle.last_recorded_mileage)
      : '',
    transmission: item?.vehicle?.transmission || '',
    fuelType: item?.vehicle?.fuel_type || '',
    salesLabel: item?.vehicle?.sales_label || '',
  };
}

function splitCountryCodeAndNumber(phoneNumber) {
  const phone = String(phoneNumber || '').trim();
  const countryCodeMatch = phone.match(/^\+\d{1,4}/);
  const countryCode = countryCodeMatch?.[0] || '+';
  const contactNumber = countryCodeMatch
    ? phone.replace(countryCode, '').replace(/\D/g, '')
    : phone.replace(/\D/g, '');
  return { countryCode, contactNumber };
}

export function useCustomerSalesData() {
  const [salesDataList, setSalesDataList] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const fetchVehicleOptions = useCallback(async () => {
    try {
      const vehiclesResponse = await getVehicles();
      const vehicleList = Array.isArray(vehiclesResponse?.data)
        ? vehiclesResponse.data
        : Array.isArray(vehiclesResponse)
          ? vehiclesResponse
          : [];
      const mappedVehicleOptions = vehicleList.map(mapVehicleOption);
      setVehicleOptions(mappedVehicleOptions);
      return mappedVehicleOptions;
    } catch (fetchError) {
      console.log(
        'useCustomerSalesData',
        'Failed to fetch vehicles from /vehicles',
        fetchError
      );
      return [];
    }
  }, []);

  const fetchSalesData = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const [salesResponse, mappedVehicleOptions] = await Promise.all([
        getCustomerSalesData(page, limit),
        fetchVehicleOptions(),
      ]);

      const response = salesResponse;
      const list = Array.isArray(response?.data) ? response.data : [];
      const mapped = list.map((item) => mapSalesDataItem(item, mappedVehicleOptions));

      setSalesDataList(mapped);
      setPagination((prev) => ({
        ...prev,
        page: Number(response?.page) || page,
        totalPages: Number(response?.pages) || 1,
        total: Number(response?.total) || 0,
        limit,
      }));
    } catch (fetchError) {
      console.log(
        'useCustomerSalesData',
        'Failed to fetch customer sales data from /customer-sales-data',
        fetchError
      );
      setError(fetchError);
    } finally {
      setIsLoading(false);
    }
  }, [fetchVehicleOptions]);

  useEffect(() => {
    fetchSalesData(pagination.page, pagination.limit);
  }, [fetchSalesData, pagination.page, pagination.limit]);

  const addSalesData = useCallback(async (data) => {
    try {
      const selectedVehicle = vehicleOptions.find((v) => v.id === data.vehicleId);
      const { countryCode, contactNumber } = splitCountryCodeAndNumber(data.customerContactNumber);
      const payload = {
        customer: {
          name: data.customerName || '',
          country_code: countryCode,
          contact_number: contactNumber,
        },
        vehicle: {
          model_id: selectedVehicle?.modelId || data.vehicleId || '',
          registration_number: data.registrationNumber || '',
          vin: data.vin || '',
          sold_date: data.soldDate || '',
          model_year: data.modelYear ? Number(data.modelYear) : null,
          variant: data.variantName || '',
          color: data.color || '',
          last_service_date: data.lastServiceDate || null,
          last_recorded_mileage: data.lastRecordedMileage ? Number(data.lastRecordedMileage) : null,
          transmission: data.transmission || null,
          fuel_type: data.fuelType || '',
          sales_label: data.salesLabel || null,
        },
      };

      const response = await createCustomerSalesData(payload);
      if (!response?.success) {
        console.log('addSalesData', 'POST /customer-sales-data did not return success true', response);
        return false;
      }

      const createdRaw = Array.isArray(response?.data) ? response.data[0] : response?.data;
      if (createdRaw) {
        const mappedCreated = mapSalesDataItem(createdRaw, vehicleOptions);
        setSalesDataList((prev) => [mappedCreated, ...prev]);
        setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
      } else {
        setSalesDataList((prev) => {
          const nextId = String(Date.now());
          const nextSalesDataId = getNextSalesDataId(prev);
          const newItem = {
            ...data,
            id: nextId,
            salesDataId: nextSalesDataId,
            vehicleName: selectedVehicle?.name || '—',
          };
          return [newItem, ...prev];
        });
      }

      if (typeof window?.showToast === 'function') {
        window.showToast('Sales data added successfully', 'success');
      }
      return true;
    } catch (error) {
      console.log('addSalesData', 'Failed to create customer sales data', error);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to add sales data', 'error');
      }
      return false;
    }
  }, [vehicleOptions]);

  const updateSalesData = useCallback((id, updated) => {
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
  }, [vehicleOptions]);

  const deleteSalesData = useCallback((id) => {
    setSalesDataList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const filteredSalesData = useMemo(
    () => ({
      byFilters: (list, filters) => {
        const { customerName, contact, vin, dateFrom, dateTo } = filters || {};
        return list.filter((item) => {
          if (customerName && customerName.trim()) {
            const nameLower = (item.customerName || '').toLowerCase();
            if (!nameLower.includes(customerName.trim().toLowerCase())) return false;
          }
          if (contact && contact.trim()) {
            const phoneNormalized = (item.customerContactNumber || '').replace(/\D/g, '');
            const searchDigits = contact.trim().replace(/\D/g, '');
            if (!phoneNormalized.includes(searchDigits)) return false;
          }
          if (vin && vin.trim()) {
            const vinLower = (item.vin || '').toLowerCase();
            if (!vinLower.includes(vin.trim().toLowerCase())) return false;
          }
          if (dateFrom && dateFrom.trim()) {
            const itemDate = item.soldDate || '';
            if (!itemDate || itemDate < dateFrom.trim()) return false;
          }
          if (dateTo && dateTo.trim()) {
            const itemDate = item.soldDate || '';
            if (!itemDate || itemDate > dateTo.trim()) return false;
          }
          return true;
        });
      },
    }),
    []
  );

  return {
    salesDataList,
    vehicleOptions,
    addSalesData,
    updateSalesData,
    deleteSalesData,
    filteredSalesData,
    isLoading,
    error,
    pagination,
    goToPage: (page) => {
      setPagination((prev) => ({ ...prev, page }));
    },
    refetchSalesData: () => fetchSalesData(pagination.page, pagination.limit),
    refetchVehicleOptions: fetchVehicleOptions,
  };
}
