import { apiClient } from './client.js';

export async function getCustomers() {
  try {
    const { data } = await apiClient.get('/customers');
    return data;
  } catch (error) {
    console.log('getCustomers', 'GET /customers', 'Error:', error);
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
