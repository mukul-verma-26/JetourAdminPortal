import { apiClient } from './client.js';

export async function getDashboard() {
  try {
    const { data } = await apiClient.get('/bookings/dashboard');
    return data?.data ?? data;
  } catch (error) {
    console.log('getDashboard', 'GET /bookings/dashboard', 'Error:', error);
    console.log('getDashboard', 'Error response:', error?.response?.data);
    console.log('getDashboard', 'Error message:', error?.message);
    throw error;
  }
}
