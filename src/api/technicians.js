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

export async function getTechnicians() {
  try {
    const { data } = await apiClient.get('/technicians');
    return data;
  } catch (error) {
    console.log('getTechnicians', 'GET /technicians', 'Error:', error);
    console.log('getTechnicians', 'Error response:', error?.response?.data);
    console.log('getTechnicians', 'Error message:', error?.message);
    throw error;
  }
}

export async function createTechnician(payload) {
  try {
    const formData = new FormData();
    formData.append('name', String(payload.name || ''));
    formData.append('contact', String(payload.contact || ''));
    formData.append('country_code', String(payload.country_code || ''));
    formData.append('email', String(payload.email || ''));
    formData.append('civil_id', String(payload.civil_id || ''));
    formData.append('nationality', String(payload.nationality || ''));
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
    const { data } = await apiClient.post('/technicians', formData, MULTIPART_CONFIG);
    return data;
  } catch (error) {
    console.log('createTechnician', 'POST /technicians', 'Error:', error);
    console.log('createTechnician', 'Error response:', error?.response?.data);
    console.log('createTechnician', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateTechnician(id, payload) {
  try {
    const formData = new FormData();
    formData.append('name', String(payload.name || ''));
    formData.append('contact', String(payload.contact || ''));
    formData.append('country_code', String(payload.country_code || ''));
    formData.append('email', String(payload.email || ''));
    formData.append('civil_id', String(payload.civil_id || ''));
    formData.append('nationality', String(payload.nationality || ''));
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
    const { data } = await apiClient.put(`/technicians/${id}`, formData, MULTIPART_CONFIG);
    return data;
  } catch (error) {
    console.log('updateTechnician', `PUT /technicians/${id}`, 'Error:', error);
    console.log('updateTechnician', 'Error response:', error?.response?.data);
    console.log('updateTechnician', 'Error message:', error?.message);
    throw error;
  }
}

export async function deleteTechnician(id) {
  try {
    const { data } = await apiClient.delete(`/technicians/${id}`);
    return data;
  } catch (error) {
    console.log('deleteTechnician', `DELETE /technicians/${id}`, 'Error:', error);
    console.log('deleteTechnician', 'Error response:', error?.response?.data);
    console.log('deleteTechnician', 'Error message:', error?.message);
    throw error;
  }
}
