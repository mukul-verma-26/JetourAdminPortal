import { apiClient } from './client.js';

export async function getAvailableSlots({ date, packageId }) {
  try {
    const { data } = await apiClient.get('/slots/available', {
      params: {
        date,
        package_id: packageId,
      },
    });
    return data;
  } catch (error) {
    console.log(
      'getAvailableSlots',
      `GET /slots/available?date=${date}&package_id=${packageId}`,
      error
    );
    throw error;
  }
}
