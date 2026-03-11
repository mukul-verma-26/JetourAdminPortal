import { apiClient } from './client.js';

export async function getAllBookings(page = 1, limit = 20) {
  try {
    const { data } = await apiClient.get('/bookings', {
      params: { page, limit },
    });
    return data;
  } catch (error) {
    console.log('getAllBookings', `GET /bookings?page=${page}&limit=${limit}`, error);
    throw error;
  }
}
