import { apiClient } from './client.js';

export async function getCustomerSalesData(page = 1, limit = 10) {
  const params = { page, limit };
  try {
    const { data } = await apiClient.get('/customer-sales-data', { params });
    return data;
  } catch (error) {
    const query = new URLSearchParams(params).toString();
    console.log('getCustomerSalesData', `GET /customer-sales-data?${query}`, error);
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
