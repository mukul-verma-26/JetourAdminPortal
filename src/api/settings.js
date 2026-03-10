import { apiClient } from './client.js';

export async function getAdminSettings() {
  try {
    const { data } = await apiClient.get('/admin/settings');
    return data;
  } catch (error) {
    console.log('getAdminSettings', 'GET /admin/settings', 'Error:', error);
    console.log('getAdminSettings', 'Error response:', error?.response?.data);
    console.log('getAdminSettings', 'Error message:', error?.message);
    throw error;
  }
}

export async function getServiceFee() {
  try {
    const { data } = await apiClient.get('/admin/settings/service-fee');
    return data;
  } catch (error) {
    console.log('getServiceFee', 'GET /admin/settings/service-fee', 'Error:', error);
    console.log('getServiceFee', 'Error response:', error?.response?.data);
    console.log('getServiceFee', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateAdminSettings(payload) {
  try {
    const { data } = await apiClient.put('/admin/settings', payload);
    return data;
  } catch (error) {
    console.log('updateAdminSettings', 'PUT /admin/settings', 'Error:', error);
    console.log('updateAdminSettings', 'Error response:', error?.response?.data);
    console.log('updateAdminSettings', 'Error message:', error?.message);
    throw error;
  }
}
