import { apiClient } from './client.js';

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
    let imageStr = '';
    if (payload.vehicle_image instanceof File) {
      const dataUrl = await fileToBase64(payload.vehicle_image);
      if (typeof dataUrl === 'string' && dataUrl.includes(',')) {
        imageStr = dataUrl.split(',')[1] || '';
      }
    } else {
      imageStr = toImageString(payload.vehicle_image);
    }
    const body = {
      vehicle_category: String(payload.vehicle_category || ''),
      vehicle_model: String(payload.vehicle_model || ''),
      vehicle_image: String(imageStr),
    };
    if (typeof body.vehicle_image !== 'string') {
      body.vehicle_image = '';
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
    let imageStr = '';
    if (payload.vehicle_image instanceof File) {
      const dataUrl = await fileToBase64(payload.vehicle_image);
      if (typeof dataUrl === 'string' && dataUrl.includes(',')) {
        imageStr = dataUrl.split(',')[1] || '';
      }
    } else {
      imageStr = toImageString(payload.vehicle_image);
      if (imageStr && imageStr.startsWith('data:')) {
        imageStr = imageStr.includes(',') ? imageStr.split(',')[1] || '' : '';
      }
    }
    const body = {
      vehicle_category: String(payload.vehicle_category || ''),
      vehicle_model: String(payload.vehicle_model || ''),
      vehicle_image: String(imageStr),
    };
    if (typeof body.vehicle_image !== 'string') {
      body.vehicle_image = '';
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
