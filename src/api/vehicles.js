import { apiClient } from './client.js';

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

export async function createVehicle(payload) {
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
    const { data } = await apiClient.post('/vehicles', body);
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
    const { data } = await apiClient.put(`/vehicles/${id}`, body);
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
