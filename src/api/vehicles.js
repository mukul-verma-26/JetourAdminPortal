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

export async function getVehicles() {
  try {
    const { data } = await apiClient.get('/vehicles');
    return data;
  } catch (error) {
    console.log('getVehicles', 'GET /vehicles', 'Error:', error);
    console.log('getVehicles', 'Error response:', error?.response?.data);
    console.log('getVehicles', 'Error message:', error?.message);
    throw error;
  }
}

export async function createVehicle(payload) {
  try {
    const formData = new FormData();
    formData.append('vehicle_category', String(payload.vehicle_category || payload.category || ''));
    formData.append('vehicle_model', String(payload.vehicle_model || payload.modelName || ''));
    const imageInput = payload.vehicle_image || payload.image;
    if (imageInput instanceof File) {
      const compressed = await compressImageIfNeeded(imageInput);
      formData.append('vehicle_image', compressed);
    } else if (imageInput && typeof imageInput === 'string') {
      formData.append('vehicle_image', imageInput.trim());
    }
    const { data } = await apiClient.post('/vehicles', formData, MULTIPART_CONFIG);
    return data;
  } catch (error) {
    console.log('createVehicle', 'POST /vehicles', 'Error:', error);
    console.log('createVehicle', 'Error response:', error?.response?.data);
    console.log('createVehicle', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateVehicle(id, payload) {
  try {
    const formData = new FormData();
    formData.append('vehicle_category', String(payload.vehicle_category || payload.category || ''));
    formData.append('vehicle_model', String(payload.vehicle_model || payload.modelName || ''));
    const imageInput = payload.vehicle_image || payload.image;
    if (imageInput instanceof File) {
      const compressed = await compressImageIfNeeded(imageInput);
      formData.append('vehicle_image', compressed);
    } else if (imageInput && typeof imageInput === 'string') {
      formData.append('vehicle_image', imageInput.trim());
    }
    const { data } = await apiClient.put(`/vehicles/${id}`, formData, MULTIPART_CONFIG);
    return data;
  } catch (error) {
    console.log('updateVehicle', `PUT /vehicles/${id}`, 'Error:', error);
    console.log('updateVehicle', 'Error response:', error?.response?.data);
    console.log('updateVehicle', 'Error message:', error?.message);
    throw error;
  }
}

export async function deleteVehicle(id) {
  try {
    const { data } = await apiClient.delete(`/vehicles/${id}`);
    return data;
  } catch (error) {
    console.log('deleteVehicle', `DELETE /vehicles/${id}`, 'Error:', error);
    console.log('deleteVehicle', 'Error response:', error?.response?.data);
    console.log('deleteVehicle', 'Error message:', error?.message);
    throw error;
  }
}
