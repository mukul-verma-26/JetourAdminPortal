import { apiClient } from './client.js';

export async function getCustomers(filters = {}) {
  const params = {};

  if (filters?.name && String(filters.name).trim()) {
    params.name = String(filters.name).trim();
  }
  if (filters?.contact_number && String(filters.contact_number).trim()) {
    params.contact_number = String(filters.contact_number).trim();
  }
  if (filters?.email && String(filters.email).trim()) {
    params.email = String(filters.email).trim();
  }
  if (Number.isFinite(Number(filters?.page)) && Number(filters.page) > 0) {
    params.page = Number(filters.page);
  }
  if (Number.isFinite(Number(filters?.limit)) && Number(filters.limit) > 0) {
    params.limit = Number(filters.limit);
  }

  try {
    const { data } = await apiClient.get('/customers', { params });
    return data;
  } catch (error) {
    const query = new URLSearchParams(params).toString();
    console.log('getCustomers', `GET /customers${query ? `?${query}` : ''}`, 'Error:', error);
    console.log('getCustomers', 'Error response:', error?.response?.data);
    console.log('getCustomers', 'Error message:', error?.message);
    throw error;
  }
}

export async function createCustomer(payload) {
  try {
    const { data } = await apiClient.post('/customers', payload);
    return data;
  } catch (error) {
    console.log('createCustomer', 'POST /customers', 'Error:', error);
    console.log('createCustomer', 'Error response:', error?.response?.data);
    console.log('createCustomer', 'Error message:', error?.message);
    throw error;
  }
}

export async function getCustomerById(id) {
  try {
    const { data } = await apiClient.get(`/customers/${id}`);
    return data;
  } catch (error) {
    console.log('getCustomerById', `GET /customers/${id}`, 'Error:', error);
    console.log('getCustomerById', 'Error response:', error?.response?.data);
    console.log('getCustomerById', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateCustomer(id, payload) {
  try {
    const { data } = await apiClient.put(`/customers/${id}`, payload);
    return data;
  } catch (error) {
    console.log('updateCustomer', `PUT /customers/${id}`, 'Error:', error);
    console.log('updateCustomer', 'Error response:', error?.response?.data);
    console.log('updateCustomer', 'Error message:', error?.message);
    throw error;
  }
}

export async function deleteCustomer(id) {
  try {
    const { data } = await apiClient.delete(`/customers/${id}`);
    return data;
  } catch (error) {
    console.log('deleteCustomer', `DELETE /customers/${id}`, 'Error:', error);
    console.log('deleteCustomer', 'Error response:', error?.response?.data);
    console.log('deleteCustomer', 'Error message:', error?.message);
    throw error;
  }
}
