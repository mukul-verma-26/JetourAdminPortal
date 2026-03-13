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

function appendNullableId(formData, key, value) {
  const normalizedValue =
    value === null || value === undefined ? 'null' : String(value).trim() || 'null';
  formData.append(key, normalizedValue);
}

export async function getServiceVans() {
  try {
    const { data } = await apiClient.get('/service-vans');
    return data;
  } catch (error) {
    console.log('getServiceVans', 'GET /service-vans', 'Error:', error);
    console.log('getServiceVans', 'Error response:', error?.response?.data);
    console.log('getServiceVans', 'Error message:', error?.message);
    throw error;
  }
}

export async function getServiceVanById(id) {
  try {
    const { data } = await apiClient.get(`/service-vans/${id}`);
    return data;
  } catch (error) {
    console.log('getServiceVanById', `GET /service-vans/${id}`, 'Error:', error);
    console.log('getServiceVanById', 'Error response:', error?.response?.data);
    console.log('getServiceVanById', 'Error message:', error?.message);
    throw error;
  }
}

export async function createServiceVan(payload) {
  try {
    const formData = new FormData();
    console.log(payload, 'payload');
    
    formData.append('registration_number', String(payload.registration_number || '').trim());
    formData.append('vehicle_model', String(payload.vehicle_model || ''));
    formData.append('mileage', String(Number(payload.mileage) || 0));
    formData.append('last_service_date', String(payload.last_service_date || '').trim());
    formData.append('status', String(payload.status || 'active'));
    appendNullableId(formData, 'technician_id', payload.technician_id);
    appendNullableId(formData, 'driver_id', payload.driver_id);
    if (payload.image instanceof File) {
      const compressed = await compressImageIfNeeded(payload.image);
      formData.append('image', compressed);
    } else if (payload.image && typeof payload.image === 'string') {
      formData.append('image', payload.image.trim());
    }
    const { data } = await apiClient.post('/service-vans', formData, MULTIPART_CONFIG);
    return data;
  } catch (error) {
    console.log('createServiceVan', 'POST /service-vans', 'Error:', error);
    console.log('createServiceVan', 'Error response:', error?.response?.data);
    console.log('createServiceVan', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateServiceVan(id, payload) {
  try {
    const formData = new FormData();
    formData.append('registration_number', String(payload.registration_number || '').trim());
    formData.append('vehicle_model', String(payload.vehicle_model || ''));
    formData.append('mileage', String(Number(payload.mileage) || 0));
    formData.append('last_service_date', String(payload.last_service_date || '').trim());
    formData.append('status', String(payload.status || 'active'));
    appendNullableId(formData, 'technician_id', payload.technician_id);
    appendNullableId(formData, 'driver_id', payload.driver_id);
    if (payload.image instanceof File) {
      const compressed = await compressImageIfNeeded(payload.image);
      formData.append('image', compressed);
    } else if (payload.image && typeof payload.image === 'string') {
      formData.append('image', payload.image.trim());
    }
    const { data } = await apiClient.put(`/service-vans/${id}`, formData, MULTIPART_CONFIG);
    return data;
  } catch (error) {
    console.log('updateServiceVan', `PUT /service-vans/${id}`, 'Error:', error);
    console.log('updateServiceVan', 'Error response:', error?.response?.data);
    console.log('updateServiceVan', 'Error message:', error?.message);
    throw error;
  }
}

export async function deleteServiceVan(id) {
  try {
    const { data } = await apiClient.delete(`/service-vans/${id}`);
    return data;
  } catch (error) {
    console.log('deleteServiceVan', `DELETE /service-vans/${id}`, 'Error:', error);
    console.log('deleteServiceVan', 'Error response:', error?.response?.data);
    console.log('deleteServiceVan', 'Error message:', error?.message);
    throw error;
  }
}
