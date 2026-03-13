import { apiClient } from './client.js';

function toApiDate(dateValue) {
  if (!dateValue) return '';
  const parts = String(dateValue).split('-');
  if (parts.length !== 3) return dateValue;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export async function getCustomerSalesData(page = 1, limit = 10, filters = {}) {
  const params = {
    page,
    limit,
    fromDate: filters?.fromDate || '',
    toDate: filters?.toDate || '',
    contact_number: filters?.contact_number || '',
    name: filters?.name || '',
    vin: filters?.vin || '',
  };
  try {
    const { data } = await apiClient.get('/customer-sales-data', { params });
    return data;
  } catch (error) {
    const query = new URLSearchParams(params).toString();
    console.log('getCustomerSalesData', `GET /customer-sales-data?${query}`, error);
    throw error;
  }
}

export async function getCustomerSalesDataForExport(filters = {}) {
  const params = {};
  if (filters?.from_date && String(filters.from_date).trim()) {
    params.from_date = toApiDate(String(filters.from_date).trim());
  }
  if (filters?.to_date && String(filters.to_date).trim()) {
    params.to_date = toApiDate(String(filters.to_date).trim());
  }

  try {
    const { data } = await apiClient.get('/customer-sales-data', { params });
    return data;
  } catch (error) {
    const query = new URLSearchParams(params).toString();
    console.log('getCustomerSalesDataForExport', `GET /customer-sales-data${query ? `?${query}` : ''}`, error);
    throw error;
  }
}

export async function createCustomerSalesData(payload) {
  try {
    const { data } = await apiClient.post('/customer-sales-data', payload);
    return data;
  } catch (error) {
    console.log('createCustomerSalesData', 'POST /customer-sales-data', error);
    throw error;
  }
}
