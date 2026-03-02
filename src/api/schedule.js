import { apiClient } from './client.js';

export async function getActiveSchedule() {
  try {
    const { data } = await apiClient.get('/schedule/active');
    return data?.data ?? data;
  } catch (error) {
    console.log('getActiveSchedule', 'GET /schedule/active', 'Error:', error);
    console.log('getActiveSchedule', 'Error response:', error?.response?.data);
    console.log('getActiveSchedule', 'Error message:', error?.message);
    throw error;
  }
}

export async function createSchedule(payload) {
  try {
    const { data } = await apiClient.post('/schedule', payload);
    return data?.data ?? data;
  } catch (error) {
    console.log('createSchedule', 'POST /schedule', 'Error:', error);
    console.log('createSchedule', 'Error response:', error?.response?.data);
    console.log('createSchedule', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateSchedule(id, payload) {
  try {
    const { data } = await apiClient.put(`/schedule/${id}`, payload);
    return data?.data ?? data;
  } catch (error) {
    console.log('updateSchedule', `PUT /schedule/${id}`, 'Error:', error);
    console.log('updateSchedule', 'Error response:', error?.response?.data);
    console.log('updateSchedule', 'Error message:', error?.message);
    throw error;
  }
}
