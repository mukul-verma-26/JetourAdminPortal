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
