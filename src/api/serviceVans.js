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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function toImageString(image) {
  if (image == null) return '';
  if (typeof image === 'string') return image.trim();
  return '';
}

export async function createServiceVan(payload) {
  try {
    const imageInput = payload.image;
    let imageStr = '';
    if (imageInput instanceof File) {
      const compressed = await compressImageIfNeeded(imageInput);
      const dataUrl = await fileToBase64(compressed);
      if (typeof dataUrl === 'string' && dataUrl.includes(',')) {
        imageStr = dataUrl.split(',')[1] || '';
      }
    } else {
      imageStr = toImageString(imageInput);
    }
    const body = {
      registration_number: String(payload.registration_number || '').trim(),
      vehicle_model: String(payload.vehicle_model || ''),
      mileage: Number(payload.mileage) || 0,
      last_service_date: String(payload.last_service_date || '').trim(),
      status: String(payload.status || 'active'),
      image: String(imageStr),
    };
    if (typeof body.image !== 'string') {
      body.image = '';
    }
    if (payload.technician_id) {
      body.technician_id = payload.technician_id;
    }
    if (payload.driver_id) {
      body.driver_id = payload.driver_id;
    }
    const { data } = await apiClient.post('/service-vans', body);
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
    const imageInput = payload.image;
    let imageStr = '';
    if (imageInput instanceof File) {
      const compressed = await compressImageIfNeeded(imageInput);
      const dataUrl = await fileToBase64(compressed);
      if (typeof dataUrl === 'string' && dataUrl.includes(',')) {
        imageStr = dataUrl.split(',')[1] || '';
      }
    } else {
      imageStr = toImageString(imageInput);
      if (imageStr && imageStr.startsWith('data:')) {
        imageStr = imageStr.includes(',') ? imageStr.split(',')[1] || '' : '';
      }
    }
    const body = {
      registration_number: String(payload.registration_number || '').trim(),
      vehicle_model: String(payload.vehicle_model || ''),
      mileage: Number(payload.mileage) || 0,
      last_service_date: String(payload.last_service_date || '').trim(),
      status: String(payload.status || 'active'),
      image: String(imageStr),
    };
    if (typeof body.image !== 'string') {
      body.image = '';
    }
    if (payload.technician_id) {
      body.technician_id = payload.technician_id;
    }
    if (payload.driver_id) {
      body.driver_id = payload.driver_id;
    }
    const { data } = await apiClient.put(`/service-vans/${id}`, body);
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
