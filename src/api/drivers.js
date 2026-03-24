import imageCompression from 'browser-image-compression';
import { apiClient } from './client.js';

const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
};

async function compressImageIfNeeded(file) {
  if (!(file instanceof File)) return file;
  try {
    return await imageCompression(file, IMAGE_COMPRESSION_OPTIONS);
  } catch (err) {
    console.log('compressImageIfNeeded', 'Compression failed, using original', err);
    return file;
  }
}

const MULTIPART_CONFIG = { headers: { 'Content-Type': 'multipart/form-data' } };

export async function getDrivers() {
  try {
    const { data } = await apiClient.get('/drivers');
    return data;
  } catch (error) {
    console.log('getDrivers', 'GET /drivers', 'Error:', error);
    console.log('getDrivers', 'Error response:', error?.response?.data);
    console.log('getDrivers', 'Error message:', error?.message);
    throw error;
  }
}

export async function createDriver(payload) {
  try {
    const formData = new FormData();
    formData.append('name', String(payload.name || ''));
    formData.append('country_code', String(payload.country_code ?? ''));
    formData.append('contact', String(payload.contact || ''));
    formData.append('civil_id', String(payload.civil_id || ''));
    formData.append('gender', String(payload.gender || 'male'));
    formData.append('status', String(payload.status || 'active'));
    formData.append('rating', String(Number(payload.rating) || 0));
    if (payload.password) {
      formData.append('password', String(payload.password));
    }
    if (payload.image instanceof File) {
      const compressed = await compressImageIfNeeded(payload.image);
      formData.append('image', compressed);
    } else if (payload.image && typeof payload.image === 'string') {
      formData.append('image', payload.image.trim());
    }
    const { data } = await apiClient.post('/drivers', formData, MULTIPART_CONFIG);
    return data;
  } catch (error) {
    console.log('createDriver', 'POST /drivers', 'Error:', error);
    console.log('createDriver', 'Error response:', error?.response?.data);
    console.log('createDriver', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateDriver(id, payload) {
  try {
    const formData = new FormData();
    formData.append('name', String(payload.name || ''));
    formData.append('country_code', String(payload.country_code ?? ''));
    formData.append('contact', String(payload.contact || ''));
    formData.append('civil_id', String(payload.civil_id || ''));
    formData.append('gender', String(payload.gender || 'male'));
    formData.append('status', String(payload.status || 'active'));
    formData.append('rating', String(Number(payload.rating) || 0));
    if (payload.password) {
      formData.append('password', String(payload.password));
    }
    if (payload.image instanceof File) {
      const compressed = await compressImageIfNeeded(payload.image);
      formData.append('image', compressed);
    } else if (payload.image && typeof payload.image === 'string') {
      formData.append('image', payload.image.trim());
    }
    const { data } = await apiClient.put(`/drivers/${id}`, formData, MULTIPART_CONFIG);
    return data;
  } catch (error) {
    console.log('updateDriver', `PUT /drivers/${id}`, 'Error:', error);
    console.log('updateDriver', 'Error response:', error?.response?.data);
    console.log('updateDriver', 'Error message:', error?.message);
    throw error;
  }
}

export async function deleteDriver(id) {
  try {
    const { data } = await apiClient.delete(`/drivers/${id}`);
    return data;
  } catch (error) {
    console.log('deleteDriver', `DELETE /drivers/${id}`, 'Error:', error);
    console.log('deleteDriver', 'Error response:', error?.response?.data);
    console.log('deleteDriver', 'Error message:', error?.message);
    throw error;
  }
}
